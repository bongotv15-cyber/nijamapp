import React from 'react';
import { useAppContext } from '../AppContext';
import { formatAmountBng } from '../utils';
import { X, CheckCircle, MessageSquare } from 'lucide-react';

export default function ShareScreen() {
  const { setCurrentScreen, shareData, showToast } = useAppContext();

  if (!shareData) return null;

  const prevStr = formatAmountBng(shareData.prev || 0);
  const gaveStr = formatAmountBng(shareData.gave || 0);
  const gotStr = formatAmountBng(shareData.got || 0);
  const currStr = formatAmountBng(shareData.curr || 0);
  const typeLabel = shareData.currType === 'customer' ? 'বাকি' : 'ডিউ';

  let shareText = '';
  if (shareData.mode === 'transaction') {
    shareText = `নিজাম ষ্টোর\nকাস্টমার: ${shareData.name}\nআগের ব্যালেন্স: ৳ ${prevStr}\nনতুন দিলাম/বেচা: ৳ ${gaveStr}\nনতুন জমা/পেলাম: ৳ ${gotStr}\nবর্তমান ব্যালেন্স: ৳ ${currStr} (${typeLabel})\nধন্যবাদ!`;
  } else {
    shareText = `নিজাম ষ্টোর\nপ্রিয় ${shareData.name},\nআপনার বর্তমান ${typeLabel} পরিমাণ: ৳ ${currStr}।\nদয়া করে বকেয়া পরিশোধ করুন।\nধন্যবাদ!`;
  }

  const shareVia = (platform: string) => {
    const phone = shareData.phone;
    if (platform === 'sms') window.location.href = `sms:${phone}?body=${encodeURIComponent(shareText)}`;
    else if (platform === 'whatsapp') window.location.href = `https://wa.me/${phone.startsWith('+') ? phone : '+88' + phone}?text=${encodeURIComponent(shareText)}`;
    else {
      if (navigator.share) navigator.share({ title: 'হিসাব', text: shareText }).catch(console.error);
      else { navigator.clipboard.writeText(shareText); showToast('কপি করা হয়েছে!', 'success'); }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f9f9f9]">
      <div className="flex items-center justify-between py-5 px-[15px] bg-primary text-white shadow-[0_2px_5px_rgba(0,0,0,0.1)] shrink-0">
        <span className="text-[18px] font-semibold">{shareData.mode === 'transaction' ? 'লেনদেন সফল' : 'তাগাদা পাঠান'}</span>
        <span className="text-[24px] cursor-pointer flex items-center" onClick={() => setCurrentScreen('home')}>
          <X size={24} />
        </span>
      </div>
      
      <div className="flex-1 p-[20px_15px] overflow-y-auto">
        <div className="bg-white rounded-[16px] p-[25px_20px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-5">
          {shareData.mode === 'transaction' ? (
            <div>
              <div className="text-[#198754] text-[45px] text-center mb-[10px] flex justify-center"><CheckCircle size={48} /></div>
              <h3 className="text-center mb-5 text-[#333] text-lg font-bold">{shareData.name}</h3>
              
              <div className="flex justify-between text-[14px] text-[#444] mb-[10px] leading-[1.5]"><span>আগের ব্যালেন্স:</span> <span className="font-semibold">৳ {prevStr}</span></div>
              <div className="flex justify-between text-[14px] text-danger mb-[10px] leading-[1.5]"><span>নতুন দিলাম/বেচা:</span> <span className="font-semibold">৳ {gaveStr}</span></div>
              <div className="flex justify-between text-[14px] text-[#198754] mb-[10px] leading-[1.5]"><span>নতুন জমা/পেলাম:</span> <span className="font-semibold">৳ {gotStr}</span></div>
              <hr className="my-3 border-0 border-t border-dashed border-[#ddd]" />
              <div className="flex justify-between text-[16px] font-bold leading-[1.5]"><span>বর্তমান ব্যালেন্স:</span> <span>৳ {currStr}</span></div>
            </div>
          ) : (
            <div className="text-center py-[10px]">
              <h3 className="mb-[10px] text-[#333] text-lg font-bold">{shareData.name}</h3>
              <p className="text-[15px] text-[#666] mb-[5px]">বর্তমান {typeLabel}</p>
              <h2 className="text-[32px] text-danger font-bold">৳ {currStr}</h2>
            </div>
          )}
        </div>

        <h4 className="mb-[15px] text-center text-[#555] font-semibold">কাস্টমারকে শেয়ার করুন</h4>
        <div className="grid grid-cols-4 gap-[10px] text-center">
          <div className="cursor-pointer transition-transform duration-200 active:scale-95" onClick={() => shareVia('sms')}>
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white text-[22px] mx-auto mb-2 bg-[#007bff]"><MessageSquare size={22} /></div>
            <span className="text-[12px] font-semibold">SMS</span>
          </div>
          <div className="cursor-pointer transition-transform duration-200 active:scale-95" onClick={() => shareVia('whatsapp')}>
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white text-[24px] mx-auto mb-2 bg-[#25d366]">WA</div>
            <span className="text-[12px] font-semibold">WhatsApp</span>
          </div>
          <div className="cursor-pointer transition-transform duration-200 active:scale-95" onClick={() => shareVia('messenger')}>
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white text-[24px] mx-auto mb-2 bg-[#0084ff]">MS</div>
            <span className="text-[12px] font-semibold">Messenger</span>
          </div>
          <div className="cursor-pointer transition-transform duration-200 active:scale-95" onClick={() => shareVia('imo')}>
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white text-[22px] mx-auto mb-2 bg-[#118cff]">Imo</div>
            <span className="text-[12px] font-semibold">Imo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
