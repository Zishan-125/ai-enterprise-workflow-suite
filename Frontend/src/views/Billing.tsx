import React, { useState } from 'react';
import { 
  X, CreditCard, Smartphone, Building2 as BankIcon, 
  ChevronRight, Crown, CheckCircle2, Loader2, Sparkles,
  Lock, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const plans = [
  { id: '3m', label: 'Quarterly', duration: '3 Months', price: '$79', trial: '30 Days Free' },
  { id: '6m', label: 'Semi-Annual', duration: '6 Months', price: '$149', trial: '30 Days Free' },
  { id: '1y', label: 'Annual Best Value', duration: '1 Year', price: '$269', trial: '30 Days Free' },
];

const paymentMethods = [
  { name: 'VISA', icon: CreditCard, color: 'text-blue-600', type: 'CARD' },
  { name: 'MASTERCARD', icon: CreditCard, color: 'text-orange-500', type: 'CARD' },
  { name: 'bKASH', icon: Smartphone, color: 'text-pink-600', type: 'MFS' },
  { name: 'NAGAD', icon: Smartphone, color: 'text-orange-600', type: 'MFS' },
  { name: 'CITY BANK', icon: BankIcon, color: 'text-emerald-700', type: 'BANK' },
  { name: 'ISLAMIC BANK', icon: BankIcon, color: 'text-green-700', type: 'BANK' },
];

const BillingView = ({ isPro, setIsPro, darkMode, setCurrentView }: any) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [activeMethod, setActiveMethod] = useState<any>(null); // State for chosen provider
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  
  // Real-world specific form state
  const [formData, setFormData] = useState({
    cardNumber: '', expiry: '', cvv: '',
    walletNumber: '',
    accountNumber: '', routingNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentConfirm = () => {
    if(!selectedPlan || !activeMethod) return;
    setIsProcessingPayment(true);
    
    // Simulated Neural Transaction with Metadata
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowSuccessAnim(true);
      
      setTimeout(() => {
        setIsPro(true);
        setShowSuccessAnim(false);
        setSelectedPlan(null);
        setActiveMethod(null);
        setCurrentView('dashboard');
      }, 3000); 
    }, 2500);
  };

  if (showSuccessAnim) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>
        <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Node Upgraded</h3>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Neural Pro protocols enabled</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Subscription Hub</span>
        <h3 className="text-5xl font-black italic uppercase tracking-tighter mt-2">Elevate your <span className="text-indigo-600">OS</span></h3>
      </div>

      {!selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-xl`}
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-2">{plan.label}</span>
              <h4 className="text-2xl font-black mb-1">{plan.duration}</h4>
              <p className="text-[10px] font-bold text-slate-500 mb-6 uppercase">{plan.trial}</p>
              <div className="text-4xl font-black italic mb-8">{plan.price}</div>
              <button 
                onClick={() => setSelectedPlan(plan)}
                className="mt-auto w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                Sync Plan
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto relative">
          <button 
            onClick={() => { setSelectedPlan(null); setActiveMethod(null); }} 
            className="absolute -right-4 -top-4 p-2 bg-slate-800 text-white rounded-full z-10"
          >
            <X size={16}/>
          </button>
          
          <div className={`p-10 rounded-[3rem] border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Sparkles size={20}/></div>
                <div>
                  <h4 className="font-black uppercase italic tracking-tight">Checkout Connection</h4>
                  <p className="text-[10px] font-bold text-slate-500">{selectedPlan.duration} • {selectedPlan.price}</p>
                </div>
              </div>
              {activeMethod && (
                <button onClick={() => setActiveMethod(null)} className="text-indigo-500 font-black text-[10px] flex items-center gap-1 hover:underline">
                  <ArrowLeft size={12}/> CHANGE
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!activeMethod ? (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Select Gateway</p>
                  {paymentMethods.map((method) => (
                    <button
                      key={method.name}
                      onClick={() => setActiveMethod(method)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500' : 'bg-slate-50 border-slate-100 hover:border-indigo-500'}`}
                    >
                      <span className="flex items-center gap-4">
                        <method.icon className={method.color} size={18}/>
                        {method.name}
                      </span>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                    <activeMethod.icon className={activeMethod.color} size={16}/>
                    <span className="text-xs font-black">{activeMethod.name} SECURE PORTAL</span>
                  </div>

                  {/* INDUSTRY SPECIFIC FORM FIELDS */}
                  <div className="space-y-4">
                    {activeMethod.type === 'CARD' && (
                      <>
                        <div>
                          <label className="text-[8px] font-black text-slate-500 uppercase block mb-2">Card Number</label>
                          <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" className={`w-full p-4 rounded-xl border text-xs font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} onChange={handleInputChange}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[8px] font-black text-slate-500 uppercase block mb-2">Expiry</label>
                            <input type="text" name="expiry" placeholder="MM/YY" className={`w-full p-4 rounded-xl border text-xs font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} onChange={handleInputChange}/>
                          </div>
                          <div>
                            <label className="text-[8px] font-black text-slate-500 uppercase block mb-2">CVV</label>
                            <input type="text" name="cvv" placeholder="***" className={`w-full p-4 rounded-xl border text-xs font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} onChange={handleInputChange}/>
                          </div>
                        </div>
                      </>
                    )}

                    {activeMethod.type === 'MFS' && (
                      <div>
                        <label className="text-[8px] font-black text-slate-500 uppercase block mb-2">{activeMethod.name} Account Number</label>
                        <input type="text" name="walletNumber" placeholder="01XXX-XXXXXX" className={`w-full p-4 rounded-xl border text-xs font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} onChange={handleInputChange}/>
                        <p className="text-[8px] text-slate-500 mt-2 italic">A 6-digit OTP will be sent to this number.</p>
                      </div>
                    )}

                    {activeMethod.type === 'BANK' && (
                      <>
                        <div>
                          <label className="text-[8px] font-black text-slate-500 uppercase block mb-2">Account Number</label>
                          <input type="text" name="accountNumber" placeholder="XXXX-XXXX-XXXX" className={`w-full p-4 rounded-xl border text-xs font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} onChange={handleInputChange}/>
                        </div>
                        <div>
                          <label className="text-[8px] font-black text-slate-500 uppercase block mb-2">Routing Number</label>
                          <input type="text" name="routingNumber" placeholder="9-Digits" className={`w-full p-4 rounded-xl border text-xs font-bold outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} onChange={handleInputChange}/>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    disabled={isProcessingPayment}
                    onClick={handlePaymentConfirm}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="animate-spin" size={18}/> 
                        Establishing Connection...
                      </>
                    ) : (
                      <>
                        <Lock size={14}/>
                        Authorize {selectedPlan.price}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingView;