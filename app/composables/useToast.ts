export const useToast = () => {
  const toast = useState('toast', () => ({ 
    show: false, 
    message: '', 
    type: 'success' as 'success' | 'error' 
  }));
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast.value = { show: true, message, type };
    setTimeout(() => {
      toast.value.show = false;
    }, 3000);
  };
  
  return { toast, showToast };
}
