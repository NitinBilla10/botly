export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        overflow: 'hidden',
        backgroundColor: 'transparent',
        pointerEvents: 'none'
      }}>
        {children}
      </body>
    </html>
  );
} 