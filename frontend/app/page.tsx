'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeInUp, FadeIn, ScaleIn, HoverCard } from '@/components/ui/motion';
import { 
  Bot, 
  MessageSquare, 
  Upload, 
  Code, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Check,
  Star,
  Sparkles,
  Brain,
  Target,
  Rocket,
  Heart
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description: 'Create intelligent chatbots powered by advanced AI that understand context and provide accurate, human-like responses'
  },
  {
    icon: Upload,
    title: 'Instant Data Training',
    description: 'Upload PDFs, documents, or website URLs to train your chatbot instantly - no technical knowledge required'
  },
  {
    icon: Code,
    title: 'One-Click Integration',
    description: 'Embed your chatbot anywhere with a single line of code. Works on any website, platform, or application'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track conversations, monitor performance, and gain insights to continuously improve your chatbot'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with end-to-end encryption and 99.9% uptime guarantee for mission-critical applications'
  },
  {
    icon: Rocket,
    title: 'Lightning Fast Setup',
    description: 'Go from zero to deployed chatbot in under 5 minutes. No coding, no complex configurations'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$19',
    period: 'per month',
    description: 'Perfect for small businesses',
    features: [
      '3 chatbots',
      '1,000 messages/month',
      'Basic analytics',
      'Email support',
      'PDF upload',
      'Website crawling'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month', 
    description: 'For growing companies',
    features: [
      'Unlimited chatbots',
      '10,000 messages/month',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'API access',
      'Multiple data sources',
      'Advanced training'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Unlimited messages',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'White-label solution',
      'Advanced security',
      'Custom deployment'
    ],
    popular: false
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager at TechCorp',
    content: 'Botly transformed our customer support. Response times dropped by 80% and customer satisfaction increased significantly. The AI actually understands our products!',
    rating: 5,
    company: 'TechCorp'
  },
  {
    name: 'Michael Chen',
    role: 'Founder of StartupXYZ',
    content: 'Setting up our chatbot took less than 10 minutes. The ROI has been incredible - we\'re handling 3x more inquiries with the same team. Game changer.',
    rating: 5,
    company: 'StartupXYZ'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Head of Support at E-commerce Plus',
    content: 'The analytics insights help us understand our customers better. Botly isn\'t just a chatbot - it\'s a business intelligence tool that keeps improving.',
    rating: 5,
    company: 'E-commerce Plus'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Botly</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Features
              </Link>
              <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Testimonials
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="mr-2 hover:bg-slate-50">Login</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" 
            style={{animationDelay: '2s'}}
          ></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <FadeInUp>
              <Badge variant="secondary" className="mb-6 border border-blue-200 bg-blue-50 text-blue-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Now with Advanced AI Integration
              </Badge>
            </FadeInUp>
            
            <FadeInUp delay={0.1}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Create AI Chatbots
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  That Actually Understand
                </span>
              </h1>
            </FadeInUp>
            
            <FadeInUp delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Upload your documents, train intelligent chatbots, and embed them anywhere. 
                Transform customer support with AI that <span className="font-semibold text-slate-800">actually understands</span> your business.
              </p>
            </FadeInUp>
            
            <FadeInUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/dashboard">
                  <Button size="lg" className="text-base px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                    <Heart className="mr-2 h-5 w-5" />
                    Start Building For Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-base px-8 py-6 hover:bg-slate-50 border-slate-300">
                  <Target className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
            </FadeInUp>

            {/* Trust Indicators */}
            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-sm text-slate-500">Trusted by 10,000+ businesses</div>
                <div className="text-sm text-slate-500">•</div>
                <div className="text-sm text-slate-500">99.9% Uptime</div>
                <div className="text-sm text-slate-500">•</div>
                <div className="text-sm text-slate-500">Enterprise Security</div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Everything You Need to Build <span className="text-blue-600">Great Chatbots</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Powerful features designed to make chatbot creation simple, effective, and scalable
              </p>
            </div>
          </FadeInUp>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeInUp key={feature.title} delay={index * 0.1}>
                <HoverCard>
                  <Card className="h-full border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                    <CardHeader>
                      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg w-fit group-hover:scale-110 transition-transform">
                        <feature.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </HoverCard>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">How It Works</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                From Idea to <span className="text-blue-600">Live Chatbot</span> in Minutes
              </h2>
              <p className="text-xl text-slate-600">
                Get your intelligent assistant up and running with our simple 3-step process
              </p>
            </div>
          </FadeInUp>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Upload Your Data',
                description: 'Upload PDFs, documents, or paste website URLs. Our AI automatically processes and understands your content to create a comprehensive knowledge base.',
                icon: Upload,
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02', 
                title: 'Configure & Train',
                description: 'Customize your chatbot personality, tone, and behavior. Our advanced AI trains on your data to understand your business context perfectly.',
                icon: Brain,
                color: 'from-indigo-500 to-indigo-600'
              },
              {
                step: '03',
                title: 'Deploy Everywhere',
                description: 'Copy the embed code and add your chatbot to any website, app, or platform. Start receiving and answering queries instantly.',
                icon: Rocket,
                color: 'from-purple-500 to-purple-600'
              }
            ].map((item, index) => (
              <FadeInUp key={item.step} delay={index * 0.1}>
                <div className="text-center group">
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className={`text-4xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>{item.step}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Pricing</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Simple, <span className="text-blue-600">Transparent Pricing</span>
              </h2>
              <p className="text-xl text-slate-600">
                Choose the plan that fits your needs. Upgrade or downgrade anytime.
              </p>
            </div>
          </FadeInUp>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <FadeInUp key={plan.name} delay={index * 0.1}>
                <HoverCard>
                  <Card className={`h-full relative ${plan.popular ? 'border-blue-500 border-2 shadow-xl scale-105' : 'border-slate-200'} group hover:shadow-lg transition-all`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                        <span className="text-slate-600 ml-2">/{plan.period}</span>
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-slate-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full mt-6 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : ''}`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </CardContent>
                  </Card>
                </HoverCard>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Trusted by <span className="text-blue-600">Thousands</span>
              </h2>
              <p className="text-xl text-slate-600">
                See what our customers have to say about their experience with Botly
              </p>
            </div>
          </FadeInUp>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInUp key={testimonial.name} delay={index * 0.1}>
                <HoverCard>
                  <Card className="h-full border-slate-200 hover:shadow-lg transition-all bg-white">
                    <CardContent className="pt-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-600 mb-6 italic leading-relaxed">&quot;{testimonial.content}&quot;</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{testimonial.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{testimonial.name}</div>
                          <div className="text-sm text-slate-500">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCard>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of businesses already using Botly to automate support, boost satisfaction, 
              and scale their customer service with intelligent AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="text-base px-8 py-6 bg-white text-blue-600 hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-white/30 text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Botly</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The easiest way to create and deploy AI chatbots for your business. Intelligent, scalable, and secure.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Botly. All rights reserved. Made with <Heart className="inline h-4 w-4 text-red-500" /> for better customer experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 