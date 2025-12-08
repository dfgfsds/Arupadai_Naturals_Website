import { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Loader, X } from 'lucide-react';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { postAddressCreateApi, updateAddressApi } from '@/api-endpoints/CartsApi';

interface AddressFormProps {
  openModal: boolean;
  handleClose: () => void;
  editData: any;
}

export default function AddressForm({ openModal, handleClose, editData }: AddressFormProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>({
    defaultValues: {
      customer_name: editData?.customer_name || '',
      address_line1: editData?.address_line1 || '',
      address_line2: editData?.address_line2 || '',
      address_type: editData?.address_type || '',
      city: editData?.city || '',
      state: editData?.state || '',
      postal_code: editData?.postal_code || '',
      country: editData?.country || '',
      landmark: editData?.landmark || '',
      contact_number: editData?.contact_number || '',
      email_address: editData?.email_address || '',
    }
  });

  const pinCode = useWatch({ control, name: "postal_code" });
  const email = useWatch({ control, name: "email_address" });
  const contact = useWatch({ control, name: "contact_number" });

  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => setValue(key, value || ''));
    }
  }, [editData, setValue]);

  if (!openModal) return null;

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    const formattedData = {
      user: userId,
      ...data,
      ...(editData ? { updated_by: userName || 'user' } : { created_by: userName || 'user' }),
    };

    try {
      if (editData) {
        await updateAddressApi(`${editData?.id}`, formattedData);
        queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
      } else {
        await postAddressCreateApi('', formattedData);
        queryClient.invalidateQueries(['postGoalType'] as InvalidateQueryFilters);
      }
      handleClose();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[9999]">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">
            {editData ? "Edit Address" : "Add Your Address"}
          </h2>
          <span onClick={() => { handleClose(), reset(); }} className="cursor-pointer">
            <X className="cursor-pointer" />
          </span>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-black">Name</label>
              <Controller
                control={control}
                name="customer_name"
                render={({ field }) => (
                  <input
                    {...field}
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            {/* Email with live validation */}
            <div>
              <label className="block text-sm font-medium text-black">Email</label>
              <Controller
                control={control}
                name="email_address"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email (e.g. example@gmail.com)",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    required
                    className={`mt-1 block w-full p-1 border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.email_address ? "border-red-500" : "border-gray-300"}`}
                  />
                )}
              />
              {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <p className="text-sm text-red-600 mt-1">Enter a valid email (e.g. example@gmail.com)</p>
              )}
            </div>

            {/* Address 1 */}
            <div>
              <label className="block text-sm font-medium text-black">Address Line 1</label>
              <Controller
                control={control}
                name="address_line1"
                render={({ field }) => (
                  <textarea
                    {...field}
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            {/* Address 2 */}
            <div>
              <label className="block text-sm font-medium text-black">Address Line 2</label>
              <Controller
                control={control}
                name="address_line2"
                render={({ field }) => (
                  <textarea
                    {...field}
                    required
                    className="mt-1 block w-full p-1 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            {/* Contact number validation */}
            <div>
              <label className="block text-sm font-medium text-black">Contact</label>
              <Controller
                control={control}
                name="contact_number"
                rules={{
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) field.onChange(value);
                    }}
                    className={`mt-1 block w-full p-1 border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.contact_number ? "border-red-500" : "border-gray-300"}`}
                  />
                )}
              />
              {contact && contact.length > 0 && contact.length < 10 && (
                <p className="text-sm text-red-600 mt-1">Enter a valid 10-digit mobile number</p>
              )}
            </div>

            {/* Other Fields */}
            <div>
              <label className="block text-sm font-medium text-black">Address Type</label>
              <Controller control={control} name="address_type" render={({ field }) => <input {...field} required className="mt-1 block w-full p-1 border rounded-md border-gray-300" />} />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">City</label>
              <Controller control={control} name="city" render={({ field }) => <input {...field} required className="mt-1 block w-full p-1 border rounded-md border-gray-300" />} />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">State</label>
              <Controller control={control} name="state" render={({ field }) => <input {...field} required className="mt-1 block w-full p-1 border rounded-md border-gray-300" />} />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Pin Code</label>
              <Controller
                control={control}
                name="postal_code"
                rules={{
                  required: "Pin code is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Enter a valid 6-digit pin code",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    maxLength={6}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                    className={`mt-1 block w-full p-1 border rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.postal_code ? "border-red-500" : "border-gray-300"}`}
                  />
                )}
              />
              {pinCode && pinCode.length > 0 && pinCode.length !== 6 && (
                <p className="text-sm text-red-600 mt-1">Enter a valid 6-digit pin code</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Country</label>
              <Controller control={control} name="country" render={({ field }) => <input {...field} required className="mt-1 block w-full p-1 border rounded-md border-gray-300" />} />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Landmark</label>
              <Controller control={control} name="landmark" render={({ field }) => <textarea {...field} className="mt-1 block w-full p-1 border rounded-md border-gray-300" />} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => { handleClose(); reset(); }}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-4 py-2 bg-[#a8822d] text-white rounded-md text-sm font-medium hover:bg-[#977526] disabled:opacity-50 flex gap-2"
            >
              Save {loading && <Loader className="animate-spin" size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
