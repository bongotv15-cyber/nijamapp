import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { formatAmountBng, formatDateBng, formatTimeBng } from '../utils';
import { ArrowLeft, MoreVertical, Bell, FileText, Edit, Trash2, MessageSquare, Camera, AlertTriangle } from 'lucide-react';

export default function TransactionScreen() {
  const { appData, updateAppData, setCurrentScreen, activePhone, setIsEditMode, showToast, setShareData } = useAppContext();
  
  const [gave, setGave] = useState('');
  const [got, setGot] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const customer = activePhone ? appData.customers[activePhone] : null;

  useEffect(() => {
    setGave('');
    setGot('');
    setDesc('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowMenu(false);
  }, [activePhone]);

  if (!customer) return null;

  const submitTransaction = () => {
    const gaveNum = parseFloat(gave) || 0;
    const gotNum = parseFloat(got) || 0;
    if (gaveNum === 0 && gotNum === 0) return showToast('টাকার পরিমাণ লিখুন', 'error');

    let netBalance = customer.type === 'customer' ? (customer.amount + gaveNum - gotNum) : (customer.amount + gotNum - gaveNum);
    let newType = customer.type;
    
    if (netBalance < 0) {
      newType = (customer.type === 'customer') ? 'supplier' : 'customer';
      netBalance = Math.abs(netBalance);
    }
    
    const newAppData = { ...appData };
    newAppData.customers[activePhone!].amount = netBalance;
    newAppData.customers[activePhone!].type = newType;
    newAppData.customers[activePhone!].time = Date.now();

    newAppData.transactions[activePhone!].unshift({
      desc: desc.trim() || 'লেনদেন যুক্ত করা হয়েছে',
      date: formatDateBng(date),
      time: formatTimeBng(new Date()),
      gave: gaveNum, got: gotNum, balance: netBalance, type: newType
    });
    
    updateAppData(newAppData);
    
    setShareData({
      mode: 'transaction', name: customer.name,
      phone: activePhone, prev: customer.amount, gave: gaveNum, got: gotNum,
      curr: netBalance, currType: newType
    });
    setCurrentScreen('share');
  };

  const handleMenuOption = (opt: string) => {
    setShowMenu(false);
    if (opt === 'লেনদেন রিপোর্ট') setCurrentScreen('report');
    else if (opt === 'কাস্টমার এডিট') {
      setIsEditMode(true);
      setCurrentScreen('add');
    }
    else if (opt === 'তাগাদা') {
      setShareData({
        mode: 'tagada', name: customer.name, phone: customer.phone, curr: customer.amount, currType: customer.type
      });
      setCurrentScreen('share');
    }
  };

  const confirmDeleteCustomer = () => {
    setShowDeleteModal(false);
    if (activePhone) {
      const newAppData = { ...appData };
      delete newAppData.customers[activePhone];
      delete newAppData.transactions[activePhone];
      updateAppData(newAppData);
      showToast('কাস্টমার ডিলিট করা হয়েছে!', 'success'); 
      setCurrentScreen('home');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f9f9f9] relative" onClick={() => setShowMenu(false)}>
      <div className="flex items-center justify-between py-5 px-[15px] font-semibold bg-primary text-white shadow-[0_2px_5px_rgba(0,0,0,0.1)] shrink-0">
        <div className="flex items-center">
          <span className="text-[24px] mr-[15px] cursor-pointer flex items-center" onClick={() => setCurrentScreen('home')}>
            <ArrowLeft size={24} />
          </span>
          <div className="ml-[10px] flex flex-col">
            <span className="text-[18px] leading-[1.2]">{customer.name}</span>
            <span className="text-[13px] font-normal leading-[1.2] opacity-90">{customer.phone}</span>
          </div>
        </div>
        <div className="cursor-pointer py-[5px] px-[10px] text-[20px] flex items-center" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
          <MoreVertical size={20} />
        </div>
      </div>
      
      {showMenu && (
        <div className="absolute top-[65px] right-[15px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.15)] w-[200px] z-[1000] border border-[#eee] overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease]">
          <div className="p-[14px_15px] text-[14px] text-[#333] cursor-pointer flex items-center gap-3 border-b border-[#f5f5f5] transition-colors duration-200 active:bg-[#f0f0f0]" onClick={() => handleMenuOption('তাগাদা')}>
            <Bell size={16} className="text-primary" /> তাগাদা
          </div>
          <div className="p-[14px_15px] text-[14px] text-[#333] cursor-pointer flex items-center gap-3 border-b border-[#f5f5f5] transition-colors duration-200 active:bg-[#f0f0f0]" onClick={() => handleMenuOption('লেনদেন রিপোর্ট')}>
            <FileText size={16} className="text-primary" /> লেনদেন রিপোর্ট
          </div>
          <div className="p-[14px_15px] text-[14px] text-[#333] cursor-pointer flex items-center gap-3 border-b border-[#f5f5f5] transition-colors duration-200 active:bg-[#f0f0f0]" onClick={() => handleMenuOption('কাস্টমার এডিট')}>
            <Edit size={16} className="text-primary" /> কাস্টমার এডিট
          </div>
          <div className="p-[14px_15px] text-[14px] text-danger cursor-pointer flex items-center gap-3 transition-colors duration-200 active:bg-[#f0f0f0]" onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}>
            <Trash2 size={16} className="text-danger" /> কাস্টমার ডিলিট
          </div>
        </div>
      )}
      
      <div className="flex-1 p-[20px_15px] overflow-y-auto">
        <div className="text-center mb-[25px] text-[16px] text-[#555] font-semibold">
          <span>{customer.type === 'customer' ? 'পাবো / বাকি:' : 'দিবো / ডিউ:'}</span> 
          <span className={`text-[26px] font-bold ml-[5px] ${customer.type === 'customer' ? 'text-primary' : 'text-danger'}`}>
            ৳ {formatAmountBng(customer.amount)}
          </span>
        </div>
        
        <div className="flex gap-[10px] mb-[15px]">
          <div className="flex-1 bg-white rounded-[10px] p-[12px_15px] border border-[#ddd] flex items-center shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <span className="text-[16px] text-[#555] mr-2 font-bold">৳</span> 
            <input type="number" placeholder="দিলাম/বেচা" className="border-none outline-none text-[18px] w-full font-semibold text-[#333]" value={gave} onChange={e => setGave(e.target.value)} />
          </div>
          <div className="flex-1 bg-white rounded-[10px] p-[12px_15px] border border-[#ddd] flex items-center shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <span className="text-[16px] text-[#555] mr-2 font-bold">৳</span> 
            <input type="number" placeholder="পেলাম/জমা" className="border-none outline-none text-[18px] w-full font-semibold text-[#333]" value={got} onChange={e => setGot(e.target.value)} />
          </div>
        </div>
        
        <div className="bg-white rounded-[10px] p-[15px] mb-[15px] border border-[#ddd] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <input type="text" placeholder="বিবরণ লিখুন (ঐচ্ছিক)" className="border-none outline-none text-[15px] w-full" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        
        <div className="flex gap-[10px] mb-5">
          <input type="date" className="flex-1 p-[10px_15px] border-none rounded-[20px] bg-[#eee] font-['Noto_Sans_Bengali',sans-serif] outline-none text-[#444] text-[14px]" value={date} onChange={e => setDate(e.target.value)} />
          <button className="flex-1 border-none p-[10px] rounded-[20px] bg-[#eee] text-[14px] cursor-pointer text-[#444] font-['Noto_Sans_Bengali',sans-serif] flex items-center justify-center gap-[6px] transition-colors duration-200 active:bg-[#ddd]" onClick={() => showToast('মেসেজ অপশনটি শীঘ্রই আসছে!', 'info')}>
            <MessageSquare size={16} /> মেসেজ
          </button>
          <button className="flex-1 border-none p-[10px] rounded-[20px] bg-[#eee] text-[14px] cursor-pointer text-[#444] font-['Noto_Sans_Bengali',sans-serif] flex items-center justify-center gap-[6px] transition-colors duration-200 active:bg-[#ddd]" onClick={() => showToast('ছবি আপলোড অপশনটি শীঘ্রই আসছে!', 'info')}>
            <Camera size={16} /> ছবি
          </button>
        </div>
      </div>
      
      <button className="w-full bg-primary text-white border-none p-[16px] text-[18px] font-bold cursor-pointer transition-colors duration-300 shrink-0 active:bg-primary-dark" onClick={submitTransaction}>নিশ্চিত করুন</button>

      {showDeleteModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-[1000] flex items-center justify-center p-5">
          <div className="bg-white rounded-[16px] p-[25px_20px] w-full max-w-[320px] text-center shadow-[0_5px_20px_rgba(0,0,0,0.2)] animate-[zoomIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="text-[40px] text-danger mb-[15px] flex justify-center"><AlertTriangle size={48} /></div>
            <h3 className="text-lg font-bold mb-2">সতর্কতা</h3>
            <p className="text-sm text-gray-600">আপনি কি নিশ্চিত যে এই কাস্টমারকে ডিলিট করতে চান? ডিলিট করলে এর সকল লেনদেনের তথ্য মুছে যাবে।</p>
            <div className="flex gap-3 justify-center mt-[25px]">
              <button className="flex-1 p-[12px] rounded-[10px] border border-[#ddd] bg-white text-[#333] font-bold text-[15px] cursor-pointer" onClick={() => setShowDeleteModal(false)}>না (No)</button>
              <button className="flex-1 p-[12px] rounded-[10px] border-none bg-danger text-white font-bold text-[15px] cursor-pointer" onClick={confirmDeleteCustomer}>হ্যাঁ (Yes)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
