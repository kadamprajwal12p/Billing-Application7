import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel file.
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 * @param sheetName Name of the sheet in the Excel file
 */
export const exportToExcel = async (data: any[], filename: string, sheetName: string = 'Sheet1') => {
    try {
        if (!data || data.length === 0) {
            console.warn('No data to export to Excel');
            return false;
        }

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Use XLSX.writeFile which is the recommended way for browsers
        XLSX.writeFile(workbook, `${filename}.xlsx`);

        console.log('Excel export successful:', filename);
        return true;
    } catch (error) {
        console.error('Excel Export Error:', error);
        // Using alert as a fallback to ensure the error is seen
        if (typeof window !== 'undefined') {
            alert('Excel Export failed: ' + (error instanceof Error ? error.message : String(error)));
        }
        return false;
    }
};

/**
 * Transforms Purchase Order list data for Excel export
 */
export const transformPOListForExcel = (purchaseOrders: any[]) => {
    return purchaseOrders.map(po => ({
        'Date': po.date ? new Date(po.date).toLocaleDateString('en-IN') : '-',
        'PO Number': po.purchaseOrderNumber || '-',
        'Reference': po.referenceNumber || '-',
        'Vendor Name': po.vendorName || '-',
        'Status': po.status || '-',
        'Billed Status': po.billedStatus || 'YET TO BE BILLED',
        'Total Amount': po.total || 0,
        'Delivery Date': po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString('en-IN') : '-'
    }));
};

/**
 * Transforms a single Purchase Order for a detailed Excel export
 */
export const transformPODetailForExcel = (po: any) => {
    if (!po) return [];

    const mainInfo = [
        { 'Field': 'Purchase Order Number', 'Value': po.purchaseOrderNumber || '-' },
        { 'Field': 'Date', 'Value': po.date ? new Date(po.date).toLocaleDateString('en-IN') : '-' },
        { 'Field': 'Vendor', 'Value': po.vendorName || '-' },
        { 'Field': 'Reference', 'Value': po.referenceNumber || '-' },
        { 'Field': 'Status', 'Value': po.status || '-' },
        { 'Field': 'Total Amount', 'Value': po.total || 0 },
        { 'Field': '', 'Value': '' }, // Spacer
        { 'Field': 'ITEMS', 'Value': '' }
    ];

    const items = (po.items || []).map((item: any) => ({
        'Field': item.itemName || '-',
        'Value': `Qty: ${item.quantity || 0} | Rate: ${item.rate || 0} | Amount: ${item.amount || 0}`
    }));

    return [...mainInfo, ...items];
};
