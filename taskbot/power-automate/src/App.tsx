import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CloudFlowsPage from './pages/CloudFlowsPage';
import DesktopFlowsPage from './pages/DesktopFlowsPage';
import AIBuilderPage from './pages/AIBuilderPage';
import ProcessMiningPage from './pages/ProcessMiningPage';
import SolutionsPage from './pages/SolutionsPage';
import IndustryFinancePage from './pages/IndustryFinancePage';
import IndustryHealthcarePage from './pages/IndustryHealthcarePage';
import IndustryManufacturingPage from './pages/IndustryManufacturingPage';
import IndustryRetailPage from './pages/IndustryRetailPage';
import FunctionHRPage from './pages/FunctionHRPage';
import FunctionITPage from './pages/FunctionITPage';
import FunctionSalesPage from './pages/FunctionSalesPage';
import FunctionCustomerServicePage from './pages/FunctionCustomerServicePage';
import PricingPage from './pages/PricingPage';
import ResourcesPage from './pages/ResourcesPage';
import DocumentationPage from './pages/DocumentationPage';
import TemplatesPage from './pages/TemplatesPage';
import BlogPage from './pages/BlogPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import WebinarsPage from './pages/WebinarsPage';
import CommunityPage from './pages/CommunityPage';
import PartnersPage from './pages/PartnersPage';
import SupportPage from './pages/SupportPage';
import ContactPage from './pages/ContactPage';
import RequestDemoPage from './pages/RequestDemoPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/cloud-flows" element={<CloudFlowsPage />} />
            <Route path="/products/desktop-flows" element={<DesktopFlowsPage />} />
            <Route path="/products/ai-builder" element={<AIBuilderPage />} />
            <Route path="/products/process-mining" element={<ProcessMiningPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/solutions/finance" element={<IndustryFinancePage />} />
            <Route path="/solutions/healthcare" element={<IndustryHealthcarePage />} />
            <Route path="/solutions/manufacturing" element={<IndustryManufacturingPage />} />
            <Route path="/solutions/retail" element={<IndustryRetailPage />} />
            <Route path="/solutions/hr" element={<FunctionHRPage />} />
            <Route path="/solutions/it" element={<FunctionITPage />} />
            <Route path="/solutions/sales" element={<FunctionSalesPage />} />
            <Route path="/solutions/customer-service" element={<FunctionCustomerServicePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/documentation" element={<DocumentationPage />} />
            <Route path="/resources/templates" element={<TemplatesPage />} />
            <Route path="/resources/blog" element={<BlogPage />} />
            <Route path="/resources/case-studies" element={<CaseStudiesPage />} />
            <Route path="/resources/webinars" element={<WebinarsPage />} />
            <Route path="/resources/community" element={<CommunityPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/request-demo" element={<RequestDemoPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
