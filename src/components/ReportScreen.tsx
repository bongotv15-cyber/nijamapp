import React from 'react';
import { useAppContext } from '../AppContext';
import { formatAmountBng } from '../utils';
import { ArrowLeft, Download, Bell } from 'lucide-react';

export default function ReportScreen() {
  const { appData, setCurrentScreen, activePhone, setShareData, showToast } = useAppContext();

  const customer = activePhone ? appData.customers[activePhone] : null;
  const records = activePhone ? (appData.transactions[activePhone] || []) : [];

  if (!customer) return null;

  const tGave = records.reduce((acc, r) => acc + r.gave, 0);
  const tGot = records.reduce((acc, r) => acc + r.got, 0);

  const handleTagada = () => {
    setShareData({
      mode: 'tagada', name: customer.name, phone: customer.phone, curr: customer.amount, currType: customer.type
    });
    setCurrentScreen('share');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f9f9f9]">
      <header className="flex items-center justify-between p-[15px_20px] border-b border-[#f0f0f0] bg-white z-[100] shrink-0">
        <div className="flex items-center">
          <div className="text-[24px] mr-[12px] cursor-pointer text-[#333] flex items-center" onClick={() => setCurrentScreen('transaction')}>
            <ArrowLeft size={24} />
          </div>
          <div className="w-[42px] h-[42px] bg-primary text-white rounded-full flex items-center justify-center font-semibold text-[16px] mr-[12px]">
            {customer.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[17px] text-[#222] leading-[1.2]">{customer.name}</span>
            <span className={`font-semibold text-[13px] mt-0.5 ${customer.type === 'customer' ? 'text-danger' : 'text-[#198754]'}`}>
              {customer.type === 'customer' ? 'পাবো ' : 'দিবো '} ৳ {formatAmountBng(customer.amount)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center cursor-pointer text-primary transition-transform duration-200 active:scale-95" onClick={() => showToast('রিপোর্ট ডাউনলোড অপশনটি শীঘ্রই আসছে!', 'info')}>
          <div className="text-[20px] mb-[2px]"><Download size={20} /></div>
          <span className="text-[11px] font-semibold">ডাউনলোড</span>
        </div>
      </header>

      <div className="p-[15px_20px] shrink-0 bg-white">
        <div className="bg-[#fafafa] p-[12px] rounded-[8px] flex items-center justify-center text-danger font-semibold text-[14px] border border-[#eee] cursor-pointer transition-colors duration-200 gap-2 active:bg-[#f0f0f0]" onClick={handleTagada}>
          <Bell size={16} /> তাগাদা মেসেজ পাঠাই
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <table className="w-full border-collapse">
          <thead className="border-y border-[#f0f0f0] bg-[#fbfbfb] sticky top-0 z-10">
            <tr>
              <th className="p-[12px_10px] text-[13px] text-[#777] font-semibold text-left pl-[20px]">লেনদেনের বিবরণ</th>
              <th className="p-[12px_10px] text-[13px] text-[#777] font-semibold text-center">দিলাম</th>
              <th className="p-[12px_10px] text-[13px] text-[#777] font-semibold text-center">পেলাম</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-5 text-[#888]">কোনো লেনদেন পাওয়া যায়নি</td>
              </tr>
            ) : (
              records.map((r, i) => {
                return (
                  <tr key={i} className="border-b border-[#f9f9f9]">
                    <td className="p-[15px_10px] align-top w-[45%] pl-[20px]">
                      <div className="text-[13px] text-[#555] mb-[3px]">{r.desc}</div>
                      <div className="font-semibold text-[13px] text-[#333]">{r.date}</div>
                      <div className="text-[11px] text-[#999] mt-[2px]">{r.time}</div>
                      <div className={`bg-[#f5f5f5] text-[11px] p-[2px_8px] rounded-[10px] inline-block mt-2 font-semibold ${r.type === 'customer' ? 'text-danger' : 'text-[#198754]'}`}>
                        {r.type === 'customer' ? 'পাবো ' : 'দিবো '} {formatAmountBng(r.balance)}
                      </div>
                    </td>
                    <td className="p-[15px_10px] align-top w-[27.5%] bg-[#fff8f8] text-danger text-center font-bold text-[15px]">
                      {r.gave > 0 ? formatAmountBng(r.gave) : ''}
                    </td>
                    <td className="p-[15px_10px] align-top w-[27.5%] text-[#198754] text-center font-bold text-[15px]">
                      {r.got > 0 ? formatAmountBng(r.got) : ''}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex border-t border-[#eee] font-bold p-[18px_0] text-[16px] bg-white shrink-0">
        <div className="w-[45%] pl-[20px]">মোট</div>
        <div className="w-[27.5%] text-center text-danger">{formatAmountBng(tGave)}</div>
        <div className="w-[27.5%] text-center text-[#333]">{formatAmountBng(tGot)}</div>
      </footer>
    </div>
  );
}
