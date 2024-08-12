export default function Home() {
  return (
    <div className="bg-light-gray text-dark-gray font-sans">
      {/* Header */}
      <header className="bg-light-gray text-dark-gray py-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold">me<span className="bg-gradient-to-l text-transparent bg-clip-text inline-block">moo</span>rize</h1>
          <nav className="flex items-center space-x-6">
            <a href="#" className="hover:text-accent-pink">Features</a>
            <a href="#" className="hover:text-accent-pink">Pricing</a>
            <a href="#" className="hover:text-accent-pink">Contact</a>
            <a href="/sign-in" className="text-primary-purple py-2 px-4 border border-primary-purple rounded-lg hover:text-muted-purple hover:border-muted-purple">Sign In</a>
            <a href="/sign-up" className="bg-gradient-to-r text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l">Sign Up</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-light-gray text-left py-20 text-dark-gray">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <h2 className="text-5xl font-bold mb-4">Develop Your Skills with AI-Powered Flashcards</h2>
              <p className="text-xl mb-8">memoorize helps you turn your text into interactive flashcards, making learning more engaging and effective.</p>
              <a href="#" className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-3 px-8 rounded-lg hover:bg-gradient-to-l">Get Started</a>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              {/* to-do: add hero image */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-l py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-8">Why Choose memoorize?</h3>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                <h4 className="text-2xl font-bold mb-4">AI-Powered Flashcards</h4>
                <p>Our AI turns your text into flashcards in seconds, making study sessions more productive.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                <h4 className="text-2xl font-bold mb-4">Customizable Learning</h4>
                <p>Tailor your flashcards to your specific learning needs, ensuring you get the most out of your study time.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                <h4 className="text-2xl font-bold mb-4">Track Your Progress</h4>
                <p>Monitor your learning journey and see how much you've improved over time with detailed analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 text-dark-gray">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-8">Affordable Pricing Plans</h3>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-lg text-dark-gray">
                <h4 className="text-2xl font-bold mb-4">Basic</h4>
                <p className="text-xl">$9.99/month</p>
                <ul className="mt-4 text-left">
                  <li className="mb-2">Unlimited Flashcards</li>
                  <li className="mb-2">Custom Themes</li>
                  <li className="mb-2">Progress Tracking</li>
                </ul>
                <a href="#" className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l mt-6 inline-block">Get Started</a>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-lg text-dark-gray">
                <h4 className="text-2xl font-bold mb-4">Pro</h4>
                <p className="text-xl">$19.99/month</p>
                <ul className="mt-4 text-left">
                  <li className="mb-2">All Basic Features</li>
                  <li className="mb-2">Advanced AI Features</li>
                  <li className="mb-2">Priority Support</li>
                </ul>
                <a href="#" className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l mt-6 inline-block">Get Started</a>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4">
              <div className="p-8 bg-white rounded-lg shadow-lg text-dark-gray">
                <h4 className="text-2xl font-bold mb-4">Enterprise</h4>
                <p className="text-xl">Contact Us</p>
                <ul className="mt-4 text-left">
                  <li className="mb-2">All Pro Features</li>
                  <li className="mb-2">Custom Integrations</li>
                  <li className="mb-2">Dedicated Account Manager</li>
                </ul>
                <a href="#" className="bg-gradient-to-r from-primary-purple to-accent-pink text-white py-2 px-4 rounded-lg hover:bg-gradient-to-l mt-6 inline-block">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-l bg-dark-gray text-white py-6">
        <div className="container mx-auto text-center px-4">
          <p>&copy; 2024 memoorize. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
