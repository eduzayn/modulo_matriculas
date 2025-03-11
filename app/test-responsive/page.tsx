'use client';

import React, { useState } from 'react';
import { ResponsiveButton } from '../components/ui/ResponsiveButton';
import { ResponsiveCard, ResponsiveCardGrid } from '../components/ui/ResponsiveCard';
import { ResponsiveLayout, ResponsiveHeader, ResponsiveSection } from '../components/ui/ResponsiveLayout';
import { ResponsiveForm, ResponsiveFormGroup, ResponsiveInput, ResponsiveSelect } from '../components/ui/ResponsiveForm';
import { colors } from '../styles/colors';
import { Download, Filter, Users, BookOpen, CreditCard, BarChart2 } from 'lucide-react';

export default function TestResponsivePage() {
  const [module, setModule] = useState<'communication' | 'student' | 'content' | 'enrollment'>('enrollment');
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const moduleColor = colors.primary[module] || { 
    main: '#F59E0B', 
    light: '#FCD34D', 
    dark: '#D97706',
    gradient: 'linear-gradient(to right, #F59E0B, #D97706)'
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="mb-8 p-4 bg-white rounded-lg border border-neutral-200">
        <h2 className="text-xl font-bold mb-4">Responsive Design Test Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Module</label>
            <select 
              className="w-full p-2 border border-neutral-200 rounded-md"
              value={module}
              onChange={(e) => setModule(e.target.value as any)}
            >
              <option value="communication">Communication (Blue)</option>
              <option value="student">Student Portal (Green)</option>
              <option value="content">Content (Purple)</option>
              <option value="enrollment">Enrollment (Yellow/Orange)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Simulate Screen Size</label>
            <select 
              className="w-full p-2 border border-neutral-200 rounded-md"
              value={screenSize}
              onChange={(e) => setScreenSize(e.target.value as any)}
            >
              <option value="mobile">Mobile (&lt; 768px)</option>
              <option value="tablet">Tablet (768px - 1023px)</option>
              <option value="desktop">Desktop (≥ 1024px)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div 
        className={`
          mx-auto transition-all duration-300
          ${screenSize === 'mobile' ? 'max-w-sm' : screenSize === 'tablet' ? 'max-w-2xl' : 'max-w-6xl'}
        `}
      >
        <ResponsiveLayout>
          <ResponsiveHeader
            title={`${module.charAt(0).toUpperCase() + module.slice(1)} Module`}
            description="Test page for responsive design components"
            actions={
              <>
                <ResponsiveButton 
                  variant="primary" 
                  module={module}
                  icon={<Filter size={16} />}
                  size="md"
                >
                  Filter
                </ResponsiveButton>
                <ResponsiveButton 
                  variant="outline" 
                  module={module}
                  icon={<Download size={16} />}
                  size="md"
                >
                  Export
                </ResponsiveButton>
              </>
            }
          />
          
          <ResponsiveSection title="Responsive Cards">
            <ResponsiveCardGrid columns={4} gap="md">
              {[
                { title: 'Total Students', value: 1248, icon: <Users size={20} /> },
                { title: 'Active Courses', value: 42, icon: <BookOpen size={20} /> },
                { title: 'Revenue', value: 'R$ 124.500', icon: <CreditCard size={20} /> },
                { title: 'Completion Rate', value: '78%', icon: <BarChart2 size={20} /> }
              ].map((stat, index) => (
                <ResponsiveCard 
                  key={index} 
                  variant="bordered" 
                  module={module}
                  title={stat.title}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="p-2 rounded-full bg-neutral-100">
                      {stat.icon}
                    </div>
                  </div>
                </ResponsiveCard>
              ))}
            </ResponsiveCardGrid>
          </ResponsiveSection>
          
          <ResponsiveSection title="Form Components">
            <ResponsiveCard variant="gradient" module={module}>
              <ResponsiveForm>
                <ResponsiveFormGroup label="Name" htmlFor="name" required>
                  <ResponsiveInput 
                    id="name" 
                    placeholder="Enter your name" 
                    module={module}
                  />
                </ResponsiveFormGroup>
                
                <ResponsiveFormGroup label="Email" htmlFor="email" required>
                  <ResponsiveInput 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    module={module}
                  />
                </ResponsiveFormGroup>
                
                <ResponsiveFormGroup label="Course" htmlFor="course">
                  <ResponsiveSelect 
                    id="course" 
                    module={module}
                    options={[
                      { value: '', label: 'Select a course' },
                      { value: 'course1', label: 'Web Development' },
                      { value: 'course2', label: 'Data Science' },
                      { value: 'course3', label: 'UX Design' }
                    ]}
                  />
                </ResponsiveFormGroup>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <ResponsiveButton variant="outline" module={module}>
                    Cancel
                  </ResponsiveButton>
                  <ResponsiveButton variant="primary" module={module}>
                    Submit
                  </ResponsiveButton>
                </div>
              </ResponsiveForm>
            </ResponsiveCard>
          </ResponsiveSection>
          
          <ResponsiveSection title="Button Variants">
            <ResponsiveCard>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Primary</p>
                  <ResponsiveButton variant="primary" module={module} fullWidth>
                    Primary
                  </ResponsiveButton>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Secondary</p>
                  <ResponsiveButton variant="secondary" module={module} fullWidth>
                    Secondary
                  </ResponsiveButton>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Outline</p>
                  <ResponsiveButton variant="outline" module={module} fullWidth>
                    Outline
                  </ResponsiveButton>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Ghost</p>
                  <ResponsiveButton variant="ghost" module={module} fullWidth>
                    Ghost
                  </ResponsiveButton>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium mb-2">Small</p>
                  <ResponsiveButton variant="primary" module={module} size="sm" fullWidth>
                    Small
                  </ResponsiveButton>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Medium</p>
                  <ResponsiveButton variant="primary" module={module} size="md" fullWidth>
                    Medium
                  </ResponsiveButton>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Large</p>
                  <ResponsiveButton variant="primary" module={module} size="lg" fullWidth>
                    Large
                  </ResponsiveButton>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">With Icon</p>
                  <ResponsiveButton 
                    variant="primary" 
                    module={module} 
                    icon={<Download size={16} />}
                    fullWidth
                  >
                    Icon
                  </ResponsiveButton>
                </div>
              </div>
            </ResponsiveCard>
          </ResponsiveSection>
          
          <ResponsiveSection title="Module Colors">
            <ResponsiveCardGrid columns={2} gap="md">
              <ResponsiveCard>
                <h3 className="text-lg font-medium mb-4">Primary Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md" 
                      style={{ background: moduleColor.main }}
                    ></div>
                    <span>Main: {moduleColor.main}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md" 
                      style={{ background: moduleColor.light }}
                    ></div>
                    <span>Light: {moduleColor.light}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md" 
                      style={{ background: moduleColor.dark }}
                    ></div>
                    <span>Dark: {moduleColor.dark}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md" 
                      style={{ background: moduleColor.gradient }}
                    ></div>
                    <span>Gradient: {moduleColor.gradient}</span>
                  </div>
                </div>
              </ResponsiveCard>
              
              <ResponsiveCard>
                <h3 className="text-lg font-medium mb-4">All Module Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md" 
                      style={{ background: colors.primary.communication.main }}
                    ></div>
                    <span>Communication: {colors.primary.communication.main}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md" 
                      style={{ background: colors.primary.student.main }}
                    ></div>
                    <span>Student: {colors.primary.student.main}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md" 
                      style={{ background: colors.primary.content.main }}
                    ></div>
                    <span>Content: {colors.primary.content.main}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-md" 
                      style={{ background: colors.primary.enrollment.main }}
                    ></div>
                    <span>Enrollment: {colors.primary.enrollment.main}</span>
                  </div>
                </div>
              </ResponsiveCard>
            </ResponsiveCardGrid>
          </ResponsiveSection>
        </ResponsiveLayout>
      </div>
    </div>
  );
}
