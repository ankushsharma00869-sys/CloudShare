```jsx
import React from 'react';
import {
  Upload,
  Share2,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';

const TestimonialSection = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy File Uploads',
      description:
        'Upload your files quickly and keep everything in one place.',
    },
    {
      icon: FolderOpen,
      title: 'Simple File Management',
      description:
        'Organize and access your files from a clean and simple dashboard.',
    },
    {
      icon: Share2,
      title: 'Quick Sharing',
      description:
        'Generate shareable links and send files without extra steps.',
    },
    {
      icon: ShieldCheck,
      title: 'Controlled Access',
      description:
        'Choose how your files are shared and keep private files protected.',
    },
  ];

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        padding: 'var(--space-24) 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Section heading */}
        <div
          style={{
            marginBottom: 'var(--space-12)',
            maxWidth: '620px',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent-bright)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-3)',
            }}
          >
            Features
          </p>

          <h2
            style={{
              fontSize: 'clamp(28px, 3.5vw, 38px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            Everything you need to manage your files
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginTop: 'var(--space-4)',
            }}
          >
            CloudShare keeps file management simple, from uploading and
            organizing files to sharing them with others.
          </p>
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-8)',
                  transition:
                    'border-color var(--duration) var(--ease)',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-btn)',
                    marginBottom: 'var(--space-5)',
                  }}
                >
                  <Icon
                    size={18}
                    color="var(--accent-bright)"
                  />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-3)',
                    marginTop: 0,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
```
