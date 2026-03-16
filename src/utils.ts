const bngMonths = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

const bngDigits: Record<string, string> = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};

export function formatAmountBng(amt: number): string {
    let str = amt.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    return str.replace(/[0-9]/g, w => bngDigits[w]);
}

export function formatTimeBng(dateObj: Date): string {
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; 
    hours = hours ? hours : 12; 
    let mStr = minutes < 10 ? '0'+minutes : minutes.toString();
    let hStr = hours < 10 ? '0'+hours : hours.toString();
    let timeStr = hStr + ':' + mStr;
    return timeStr.replace(/[0-9]/g, w => bngDigits[w]) + ' ' + ampm;
}

export function formatDateBng(dateString: string): string { 
    if(!dateString) return "";
    let parts = dateString.split('-');
    let m = parseInt(parts[1]) - 1;
    let dStr = parts[2].replace(/[0-9]/g, w => bngDigits[w]);
    let yStr = parts[0].replace(/[0-9]/g, w => bngDigits[w]);
    return dStr + ' ' + bngMonths[m] + ', ' + yStr;
}

export function toBngDigits(num: number | string): string {
    return num.toString().replace(/[0-9]/g, w => bngDigits[w]);
}
