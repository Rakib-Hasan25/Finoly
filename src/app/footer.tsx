import { useState } from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const TermsAndConditionsContent = `
শর্তাবলী

এখানে আপনি আমাদের সকল নিয়ম ও শর্তাবলী দেখতে পারবেন। ফিনোলি ব্যবহার করার আগে অনুগ্রহ করে এই শর্তাবলীগুলো মনোযোগ সহকারে পড়ুন। আমাদের সেবা ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলী মেনে নিতে সম্মত হচ্ছেন।

১. সেবার ব্যবহার
আমাদের সেবা শুধুমাত্র ব্যক্তিগত ও অ-বাণিজ্যিক ব্যবহারের জন্য। আপনি কোনো বেআইনি উদ্দেশ্যে আমাদের সেবা ব্যবহার করতে পারবেন না।

২. ডেটা গোপনীয়তা
আপনার ডেটা সুরক্ষিত রাখা আমাদের সর্বোচ্চ অগ্রাধিকার। আমাদের গোপনীয়তা নীতিতে এই বিষয়ে বিস্তারিত তথ্য দেওয়া আছে।

৩. দায়বদ্ধতার সীমাবদ্ধতা
ফিনোলি কোনো ধরনের প্রত্যক্ষ, পরোক্ষ, আনুষঙ্গিক, বিশেষ, বা শাস্তিমূলক ক্ষতির জন্য দায়ী হবে না।

৪. পরিবর্তনের অধিকার
আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি। পরিবর্তনগুলো কার্যকর হওয়ার সাথে সাথে আপনাকে জানানো হবে।
`;

  const PrivacyPolicyContent = `
গোপনীয়তা নীতি

এই গোপনীয়তা নীতি আমাদের ওয়েবসাইটে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ করার নীতি বর্ণনা করে।

১. তথ্য সংগ্রহ
আমরা আপনার ব্যক্তিগত তথ্য সংগ্রহ করি যখন আপনি আমাদের অ্যাপে নিবন্ধন করেন বা আমাদের সেবা ব্যবহার করেন। এই তথ্যের মধ্যে আপনার নাম, ইমেল ঠিকানা এবং ব্যাংক অ্যাকাউন্টের বিবরণ অন্তর্ভুক্ত থাকতে পারে।

২. তথ্যের ব্যবহার
আমরা আপনার তথ্য ব্যবহার করি সেবা প্রদান, লেনদেন প্রক্রিয়া, আপনার অ্যাকাউন্ট পরিচালনা, এবং আমাদের পণ্য ও সেবা উন্নত করার জন্য।

৩. তথ্যের প্রকাশ
আমরা আপনার অনুমতি ছাড়া আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি, ভাড়া বা প্রকাশ করি না, তবে আইন দ্বারা বাধ্য হলে ব্যতিক্রম হতে পারে।

৪. তথ্য নিরাপত্তা
আমরা আপনার তথ্য সুরক্ষিত রাখার জন্য যুক্তিসঙ্গত নিরাপত্তা ব্যবস্থা গ্রহণ করি। তবে, কোনো ইলেকট্রনিক স্টোরেজ বা ইনটাআর্নেটে ডেটা ট্রান্সমিশন ১০০% সুরক্ষিত নয়।
`;

  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Footer */}
      <footer className="bg-[#102D37] py-8 text-center text-gray-400 relative">
        <div className="container mx-auto px-4">
          <p className="mb-4">&copy; {new Date().getFullYear()} ফিনোলি। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex justify-center space-x-4">
            <Link href="#" onClick={(e) => { e.preventDefault(); openModal("শর্তাবলী", TermsAndConditionsContent); }} className="hover:text-white transition-colors">
              শর্তাবলী
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="#" onClick={(e) => { e.preventDefault(); openModal("গোপনীয়তা নীতি", PrivacyPolicyContent); }} className="hover:text-white transition-colors">
              গোপনীয়তা নীতি
            </Link>
          </div>
        </div>
      </footer>
      
      {/* Modal - Inline implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
          <div className="relative w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto rounded-xl bg-[#102D37] p-8 shadow-2xl transform transition-transform duration-300 scale-95">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-gray-600 pb-4">{modalContent.title}</h2>
            <div className="text-gray-300 leading-relaxed space-y-4">
              {modalContent.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;