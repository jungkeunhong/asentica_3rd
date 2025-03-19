// pages/privacy-policy.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Your Company</title>
        <meta name="description" content="Privacy policy for Your Company" />
      </Head>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">PRIVACY NOTICE</h1>
        <p className="text-sm mb-6">Last updated March 1, 2025</p>

        <div className="mb-10">
          <p className="mb-4">
            This Privacy Notice for Your Company ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>Visit our website at https://yourcompany.com, or any website of ours that links to this Privacy Notice</li>
            <li>Download and use our application, or any other application of ours that links to this Privacy Notice</li>
            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
          </ul>
          <p className="font-medium">
            Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">SUMMARY OF KEY POINTS</h2>
          <p className="mb-4">
            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
          </p>
          
          <div className="space-y-4 mb-6">
            <p><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
            
            <p><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</p>
            
            <p><strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.</p>
            
            <p><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
            
            <p><strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties.</p>
            
            <p><strong>How do we keep your information safe?</strong> We have organizational and technical processes and procedures in place to protect your personal information.</p>
            
            <p><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">TABLE OF CONTENTS</h2>
          <ol className="list-decimal pl-8 space-y-2">
            <li><a href="#section1" className="text-blue-600 hover:underline">WHAT INFORMATION DO WE COLLECT?</a></li>
            <li><a href="#section2" className="text-blue-600 hover:underline">HOW DO WE PROCESS YOUR INFORMATION?</a></li>
            <li><a href="#section3" className="text-blue-600 hover:underline">WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</a></li>
            <li><a href="#section4" className="text-blue-600 hover:underline">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
            <li><a href="#section5" className="text-blue-600 hover:underline">WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</a></li>
            <li><a href="#section6" className="text-blue-600 hover:underline">DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></li>
            <li><a href="#section7" className="text-blue-600 hover:underline">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></li>
            <li><a href="#section8" className="text-blue-600 hover:underline">HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
            <li><a href="#section9" className="text-blue-600 hover:underline">HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
            <li><a href="#section10" className="text-blue-600 hover:underline">WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
            <li><a href="#section11" className="text-blue-600 hover:underline">CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
            <li><a href="#section12" className="text-blue-600 hover:underline">DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></li>
            <li><a href="#section13" className="text-blue-600 hover:underline">DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
            <li><a href="#section14" className="text-blue-600 hover:underline">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
            <li><a href="#section15" className="text-blue-600 hover:underline">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
          </ol>
        </div>

        <div id="section1" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. WHAT INFORMATION DO WE COLLECT?</h2>
          <h3 className="text-xl font-semibold mb-2">Personal information you disclose to us</h3>
          <p className="italic mb-2">In Short: We collect personal information that you provide to us.</p>
          
          <p className="mb-4">
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </p>
          
          <p className="mb-2"><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
          <ul className="list-disc pl-8 mb-4">
            <li>names</li>
            <li>phone numbers</li>
            <li>email addresses</li>
            <li>passwords</li>
          </ul>
          
          <p className="mb-4"><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
          
          <p className="mb-4"><strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account.</p>
          
          <p className="mb-4"><strong>Application Data.</strong> If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:</p>
          <ul className="list-disc pl-8 mb-4">
            <li><em>Mobile Device Access.</em> We may request access or permission to certain features from your mobile device, including your mobile device's social media accounts, and other features.</li>
            <li><em>Push Notifications.</em> We may request to send you push notifications regarding your account or certain features of the application(s).</li>
          </ul>
        </div>
        
        {/* Additional sections would continue here */}
        
        <div id="section14" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p>
            If you have questions or comments about this notice, you may contact us by email at:
            <a href="mailto:privacy@yourcompany.com" className="text-blue-600 ml-1 hover:underline">privacy@yourcompany.com</a>
          </p>
        </div>
        
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <div className="mt-2 flex space-x-4">
            <Link href="/terms" className="text-sm text-gray-600 hover:underline">
              Terms of Service
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:underline">
              Home
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
