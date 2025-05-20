
import { ShopLayout } from "@/components/layout/ShopLayout";

const Privacy = () => {
  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-sm md:prose-base">
            <p>
              This Privacy Policy describes how we collect, use, and disclose your information when you use our services or shop on our website.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect several types of information from and about users of our Website, including information:
            </p>
            <ul>
              <li className="mb-2">By which you may be personally identified, such as name, postal address, e-mail address, telephone number, and any other identifier by which you may be contacted online or offline ("personal information")</li>
              <li className="mb-2">That is about you but individually does not identify you, such as your shopping preferences, browsing behavior, and demographic information</li>
              <li className="mb-2">About your internet connection, the equipment you use to access our Website, and usage details</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">2. How We Collect Your Information</h2>
            <p>
              We collect this information:
            </p>
            <ul>
              <li className="mb-2">Directly from you when you provide it to us (e.g., when you create an account, place an order, or contact customer service)</li>
              <li className="mb-2">Automatically as you navigate through the site (information collected automatically may include usage details, IP addresses, and information collected through cookies, web beacons, and other tracking technologies)</li>
              <li className="mb-2">From third parties, for example, our business partners</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>
              We use information that we collect about you or that you provide to us, including any personal information:
            </p>
            <ul>
              <li className="mb-2">To present our Website and its contents to you</li>
              <li className="mb-2">To process and fulfill your orders, including to provide order confirmations and shipping updates</li>
              <li className="mb-2">To provide you with information, products, or services that you request from us</li>
              <li className="mb-2">To create and maintain your account and to authenticate your identity</li>
              <li className="mb-2">To provide you with notices about your account or purchases</li>
              <li className="mb-2">To respond to your inquiries and customer service requests</li>
              <li className="mb-2">To send you promotional materials about our products and services</li>
              <li className="mb-2">To improve our Website, products, and services</li>
              <li className="mb-2">To customize your experience on our Website</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">4. Disclosure of Your Information</h2>
            <p>
              We may disclose aggregated information about our users, and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy:
            </p>
            <ul>
              <li className="mb-2">To our subsidiaries and affiliates</li>
              <li className="mb-2">To contractors, service providers, and other third parties we use to support our business (e.g., payment processors, shipping providers, analytics providers)</li>
              <li className="mb-2">To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of our assets</li>
              <li className="mb-2">To comply with any court order, law, or legal process, including to respond to any government or regulatory request</li>
              <li className="mb-2">To enforce or apply our terms of use and other agreements</li>
              <li className="mb-2">If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of us, our customers, or others</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies, web beacons, and other tracking technologies to enhance your experience on our Website, analyze usage patterns, and improve our services. You can control cookies through your browser settings and other tools. However, if you block certain cookies, you may not be able to use all the features of our Website.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">6. Data Security</h2>
            <p>
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Website.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">7. Your Choices About How We Use Your Information</h2>
            <p>
              We provide you with choices regarding the personal information you provide to us. You can:
            </p>
            <ul>
              <li className="mb-2">Update or correct your account information by logging into your account</li>
              <li className="mb-2">Opt-out of marketing emails by following the unsubscribe link in the emails</li>
              <li className="mb-2">Request access to, correction of, or deletion of your personal information by contacting us</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">8. Changes to Our Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. If we make material changes to how we treat our users' personal information, we will notify you through a notice on our Website or by email. The date the privacy policy was last revised is identified at the bottom of this page.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">9. Contact Information</h2>
            <p>
              If you have any questions or concerns about our privacy policy or practices, please contact us at:
            </p>
            <p>
              Email: privacy@myeshop.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Main Street, New York, NY 10001, United States
            </p>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Last updated: May 20, 2023</p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default Privacy;
