import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  ClipboardList,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { calculateAnalysis, formatCurrency, formatPercent } from '../utils/calculations';

export default function ImportSheetModal({ isOpen, onClose }) {
  const { importAnalysesFromSheet, currency, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [selectedIndices, setSelectedIndices] = useState(new Set());

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Clean numerical input (removes $, ₹, %, commas, etc.)
  const parseNum = (val, defaultVal = 0) => {
    if (val === undefined || val === null) return defaultVal;
    if (typeof val === 'number') return isNaN(val) ? defaultVal : val;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? defaultVal : num;
  };

  // Flexible CSV / TSV string parser
  const parseDelimitedText = (text) => {
    setParseError('');
    const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    if (rawLines.length < 2) {
      setParseError('The sheet needs at least 1 header row and 1 data row.');
      return;
    }

    // Determine delimiter: tab, comma, semicolon
    const firstLine = rawLines[0];
    let delimiter = ',';
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';

    // Helper to parse line handling quotes
    const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim().replace(/^["']|["']$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      return result;
    };

    const headers = parseLine(rawLines[0]).map(h => h.toLowerCase().trim());

    // Header index finder helper
    const findIndex = (keywords) => {
      return headers.findIndex(h => keywords.some(k => h.includes(k)));
    };

    const idxCampaign = findIndex(['campaign', 'title', 'name', 'promotion', 'product']);
    const idxSku = findIndex(['sku', 'code', 'item id', 'id']);
    const idxCategory = findIndex(['category', 'dept', 'department', 'type']);
    const idxPrice = findIndex(['base price', 'selling price', 'price', 'msrp', 'retail']);
    const idxCost = findIndex(['cost', 'cogs', 'unit cost', 'landed']);
    const idxVolume = findIndex(['base volume', 'volume', 'units', 'base units', 'sales']);
    const idxDiscount = findIndex(['discount %', 'discount', 'disc %', 'promo discount']);
    const idxUplift = findIndex(['volume uplift %', 'volume uplift', 'uplift %', 'lift %', 'growth %']);
    const idxHorizon = findIndex(['horizon', 'period', 'duration', 'time']);

    const rows = [];

    for (let i = 1; i < rawLines.length; i++) {
      const cells = parseLine(rawLines[i]);
      if (cells.length < 2) continue;

      const campaign = idxCampaign !== -1 && cells[idxCampaign] ? cells[idxCampaign] : `Campaign Row ${i}`;
      const sku = idxSku !== -1 && cells[idxSku] ? cells[idxSku] : `SKU-${100 + i}`;
      const category = idxCategory !== -1 && cells[idxCategory] ? cells[idxCategory] : 'General Merchandising';
      const basePrice = idxPrice !== -1 ? parseNum(cells[idxPrice], 1000) : 1000;
      const cost = idxCost !== -1 ? parseNum(cells[idxCost], 600) : 600;
      const baseVolume = idxVolume !== -1 ? parseNum(cells[idxVolume], 100) : 100;
      const discountPercent = idxDiscount !== -1 ? parseNum(cells[idxDiscount], 10) : 10;
      const volumeUpliftPercent = idxUplift !== -1 ? parseNum(cells[idxUplift], 25) : 25;
      const horizon = idxHorizon !== -1 && cells[idxHorizon] ? cells[idxHorizon] : '7-Day Flash';

      const entry = {
        id: `RUN-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}-${i}`,
        campaign,
        sku,
        category,
        edition: 'Imported Record',
        basePrice,
        cost,
        baseVolume,
        discountPercent,
        volumeUpliftPercent,
        horizon
      };

      const calc = calculateAnalysis(entry);
      entry.status = calc.riskClassification;
      entry.breakEvenUnits = calc.requiredBreakEvenUnits;
      entry.marginDelta = calc.grossProfitDelta;

      rows.push(entry);
    }

    if (rows.length === 0) {
      setParseError('Could not extract valid data rows. Check columns and formatting.');
      return;
    }

    setParsedRows(rows);
    setSelectedIndices(new Set(rows.map((_, idx) => idx)));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        parseDelimitedText(text);
      } catch (err) {
        setParseError('Error parsing file: ' + err.message);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read file.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handlePasteParse = () => {
    if (!pastedText.trim()) {
      setParseError('Please paste your spreadsheet data or table text first.');
      return;
    }
    parseDelimitedText(pastedText);
  };

  const handleDownloadTemplate = () => {
    const templateHeaders = [
      'Campaign Title',
      'SKU',
      'Category',
      'Base Price',
      'Unit Cost',
      'Base Volume',
      'Discount %',
      'Volume Uplift %',
      'Horizon'
    ];

    const sampleRows = [
      ['Festive Canvas Backpack', 'BP-102', 'Travel Gear', '1000', '600', '100', '10', '35', '7-Day Flash'],
      ['Merino Wool Overshirt', 'AP-409', 'Apparel', '2400', '1500', '67', '20', '25', '30-Day'],
      ['Ceramic Mug Set', 'HG-882', 'Home Goods', '800', '320', '100', '15', '35', 'Weekend'],
      ['Leather Desk Mat', 'WS-330', 'Workspace', '1500', '1100', '200', '12', '25', 'Quarterly']
    ];

    const csv = [templateHeaders.join(','), ...sampleRows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_discount_campaigns_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Sample spreadsheet template downloaded!', 'success');
  };

  const toggleSelectAll = () => {
    if (selectedIndices.size === parsedRows.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(parsedRows.map((_, idx) => idx)));
    }
  };

  const toggleSelectRow = (idx) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleConfirmImport = async () => {
    const itemsToImport = parsedRows.filter((_, idx) => selectedIndices.has(idx));
    if (itemsToImport.length === 0) {
      addToast('Please select at least 1 row to import', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      await importAnalysesFromSheet(itemsToImport);
      onClose();
      // Reset
      setParsedRows([]);
      setPastedText('');
      setFileName('');
      setSelectedIndices(new Set());
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 30, 22, 0.65)',
      backdropFilter: 'blur(5px)',
      zIndex: 9995,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #DDD7C9',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '840px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 48px -12px rgba(15, 30, 20, 0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FAF8F4',
          borderBottom: '1px solid #ECE7DC',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#153825',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#153825',
                letterSpacing: '-0.3px',
                margin: 0
              }}>
                Import Campaign Data from Sheet
              </h2>
              <p style={{ fontSize: '12.5px', color: '#687069', margin: '2px 0 0 0' }}>
                Upload a CSV/Excel export or paste cells directly from Google Sheets
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleDownloadTemplate}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', gap: '6px' }}
              title="Download pre-formatted CSV template"
            >
              <Download size={13} />
              <span>Sample Template</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#7E867F',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Method Selector Tabs */}
          {parsedRows.length === 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                backgroundColor: '#F3EFE6',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid #E4DDCD'
              }}>
                <button
                  onClick={() => { setActiveTab('upload'); setParseError(''); }}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: activeTab === 'upload' ? '#FFFFFF' : 'transparent',
                    color: activeTab === 'upload' ? '#153825' : '#6A726B',
                    fontWeight: activeTab === 'upload' ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'upload' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Upload size={14} />
                  <span>Upload File (.csv / .tsv)</span>
                </button>
                <button
                  onClick={() => { setActiveTab('paste'); setParseError(''); }}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: activeTab === 'paste' ? '#FFFFFF' : 'transparent',
                    color: activeTab === 'paste' ? '#153825' : '#6A726B',
                    fontWeight: activeTab === 'paste' ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'paste' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ClipboardList size={14} />
                  <span>Paste From Google Sheets / Excel</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {parseError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#991B1B',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} style={{ color: '#DC2626', flexShrink: 0 }} />
              <span>{parseError}</span>
            </div>
          )}

          {/* Upload Method Form */}
          {parsedRows.length === 0 && activeTab === 'upload' && (
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#153825'; }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#CBD5CD'; }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#CBD5CD';
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const f = e.dataTransfer.files[0];
                  setFileName(f.name);
                  const reader = new FileReader();
                  reader.onload = (event) => parseDelimitedText(event.target.result);
                  reader.readAsText(f);
                }
              }}
              style={{
                border: '2px dashed #CBD5CD',
                borderRadius: '12px',
                padding: '40px 24px',
                textAlign: 'center',
                backgroundColor: '#FAF9F6',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .tsv, .txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#EBF2EC',
                color: '#153825',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <Upload size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1B211C', margin: '0 0 6px 0' }}>
                Drag and drop your spreadsheet file here, or browse
              </h3>
              <p style={{ fontSize: '12.5px', color: '#6A726B', margin: 0 }}>
                Supports standard comma-separated (.csv) and tab-separated (.tsv) exports
              </p>
            </div>
          )}

          {/* Paste Method Form */}
          {parsedRows.length === 0 && activeTab === 'paste' && (
            <div>
              <p style={{ fontSize: '13px', color: '#4E554F', marginBottom: '8px' }}>
                Copy your rows (including the header row) in Google Sheets or Microsoft Excel, and paste them below:
              </p>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Campaign Title&#9;SKU&#9;Base Price&#9;Unit Cost&#9;Base Volume&#9;Discount %&#9;Volume Uplift %&#10;Festive Canvas Backpack&#9;BP-102&#9;1000&#9;600&#9;100&#9;10&#9;35"
                rows={7}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #DDD7CA',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  color: '#1B211C',
                  outline: 'none',
                  resize: 'vertical',
                  marginBottom: '14px',
                  backgroundColor: '#FAF9F6'
                }}
              />
              <button
                onClick={handlePasteParse}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px', gap: '6px' }}
              >
                <span>Parse & Preview Data</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Parsed Data Preview Table */}
          {parsedRows.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: '#166534' }} />
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#153825' }}>
                    Successfully parsed {parsedRows.length} {parsedRows.length === 1 ? 'campaign row' : 'campaign rows'}
                  </span>
                  {fileName && (
                    <span style={{ fontSize: '12px', color: '#70776F', backgroundColor: '#F0ECE1', padding: '2px 8px', borderRadius: '4px' }}>
                      {fileName}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={toggleSelectAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#153825',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {selectedIndices.size === parsedRows.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={() => { setParsedRows([]); setFileName(''); setPastedText(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#991B1B',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={12} />
                    <span>Clear Data</span>
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div style={{
                maxHeight: '340px',
                overflowY: 'auto',
                border: '1px solid #E6E0D3',
                borderRadius: '8px'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#FAF8F4', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid #E6E0D3' }}>
                    <tr>
                      <th style={{ padding: '8px 12px', width: '36px' }}>
                        <input
                          type="checkbox"
                          checked={selectedIndices.size === parsedRows.length && parsedRows.length > 0}
                          onChange={toggleSelectAll}
                          style={{ accentColor: '#153825', cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ padding: '8px 12px', color: '#4E5650', fontWeight: 600 }}>Campaign</th>
                      <th style={{ padding: '8px 12px', color: '#4E5650', fontWeight: 600 }}>SKU</th>
                      <th style={{ padding: '8px 12px', color: '#4E5650', fontWeight: 600, textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '8px 12px', color: '#4E5650', fontWeight: 600, textAlign: 'right' }}>Cost</th>
                      <th style={{ padding: '8px 12px', color: '#4E5650', fontWeight: 600, textAlign: 'right' }}>Discount</th>
                      <th style={{ padding: '8px 12px', color: '#4E5650', fontWeight: 600, textAlign: 'right' }}>Uplift</th>
                      <th style={{ padding: '8px 12px', color: '#4E5650', fontWeight: 600 }}>Break-Even</th>
                      <th style={{ padding: '8px 12px', color: '#4E5650', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, idx) => {
                      const isSelected = selectedIndices.has(idx);
                      const isAlert = row.status.toLowerCase().includes('dilution') || row.status.toLowerCase().includes('negative');

                      return (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid #F0ECE1',
                            backgroundColor: isSelected ? '#FFFFFF' : '#F9F8F5',
                            opacity: isSelected ? 1 : 0.6
                          }}
                        >
                          <td style={{ padding: '8px 12px' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(idx)}
                              style={{ accentColor: '#153825', cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1B211C' }}>
                            {row.campaign}
                          </td>
                          <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: '#687069' }}>
                            {row.sku}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            {formatCurrency(row.basePrice, currency)}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#687069' }}>
                            {formatCurrency(row.cost, currency)}
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#153825' }}>
                            {row.discountPercent}%
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: '#166534' }}>
                            +{row.volumeUpliftPercent}%
                          </td>
                          <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>
                            {row.breakEvenUnits} units
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: isAlert ? '#FEE2E2' : '#DCFCE7',
                              color: isAlert ? '#991B1B' : '#166534'
                            }}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          backgroundColor: '#FAF8F4',
          borderTop: '1px solid #ECE7DC',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '12px', color: '#70776F' }}>
            {parsedRows.length > 0 ? (
              <span>{selectedIndices.size} of {parsedRows.length} rows selected</span>
            ) : (
              <span>Columns are automatically mapped and normalized</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Cancel
            </button>

            {parsedRows.length > 0 && (
              <button
                onClick={handleConfirmImport}
                disabled={isProcessing || selectedIndices.size === 0}
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  opacity: selectedIndices.size === 0 ? 0.6 : 1
                }}
              >
                {isProcessing ? 'Importing...' : `Confirm & Import (${selectedIndices.size})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
