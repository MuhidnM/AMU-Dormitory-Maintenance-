import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, Loader2, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Please provide a more detailed description'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.string().min(1, 'Please select priority level'),
  dormInfo: z.string().min(2, 'Dorm/Block/Room info is required'),
});

const RequestForm = () => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleImageChange = (e) => {
    setImageError('');
    const files = Array.from(e.target.files);
    
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    const validFiles = [];
    const oversizedFiles = [];

    files.forEach(file => {
      if (file.size <= MAX_FILE_SIZE) {
        validFiles.push(file);
      } else {
        oversizedFiles.push(file.name);
      }
    });

    if (oversizedFiles.length > 0) {
      setImageError(`The following file(s) exceed the 1MB limit: ${oversizedFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      images.forEach(image => formData.append('images', image));

      await api.post('/requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
      setTimeout(() => navigate('/student'), 2000);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl"
      >
        <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full mb-6">
          <CheckCircle className="text-green-600 dark:text-green-400 w-14 h-14" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Request Submitted!</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Redirecting you to dashboard...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl transition-colors duration-300"
    >
      {/* Heading */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl">
            <AlertTriangle className="text-red-600 dark:text-red-400 w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-red-600 dark:text-red-500 tracking-tight">New Maintenance Request</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-base font-bold ml-[52px]">Fill in the details below to report a maintenance issue.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Issue Title</label>
          <input
            {...register('title')}
            className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold dark:text-white dark:placeholder-slate-500 ${errors.title ? 'border-red-500 focus:ring-red-100' : 'border-slate-100 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-50'
              }`}
            placeholder="e.g., Broken pipe in bathroom"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all font-semibold dark:text-white"
            >
              <option value="" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Select Category</option>
              <option value="PLUMBING" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Plumbing</option>
              <option value="ELECTRICAL" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Electrical</option>
              <option value="FURNITURE" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Furniture</option>
              <option value="LOCKS" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Locks/Doors</option>
              <option value="INTERNET" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Internet</option>
              <option value="CLEANING" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Cleaning</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Priority</label>
            <select
              {...register('priority')}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all font-semibold dark:text-white"
            >
              <option value="LOW" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Low</option>
              <option value="MEDIUM" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Medium</option>
              <option value="HIGH" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">High</option>
              <option value="URGENT" className="bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-white">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Dormitory Location</label>
          <input
            {...register('dormInfo')}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all font-semibold dark:text-white dark:placeholder-slate-500"
            placeholder="e.g., Block A, Room 101, Bed 2"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
          <textarea
            {...register('description')}
            rows="4"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all resize-none font-semibold dark:text-white dark:placeholder-slate-500"
            placeholder="Describe the issue in detail..."
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Images (Optional) <span className="text-xs text-slate-400 font-normal ml-2">(Max size: 1MB per image)</span></label>
          {imageError && (
            <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={14} />
              <span>{imageError}</span>
            </div>
          )}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {previews.map((src, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border-2 border-slate-100 dark:border-slate-700">
                <img src={src} className="w-full h-full object-cover" alt="Preview" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl aspect-square cursor-pointer hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group">
                <Upload className="text-slate-400 group-hover:text-red-500 transition-colors" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 group-hover:text-red-500 transition-colors">Upload</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/student')}
            className="flex-1 px-6 py-3.5 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex-[2] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Submit Request
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default RequestForm;
