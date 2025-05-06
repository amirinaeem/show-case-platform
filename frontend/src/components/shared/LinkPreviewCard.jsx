import { Card } from 'react-bootstrap';

const LinkPreviewCard = ({ linkPreview }) => {
  if (!linkPreview?.url) return null;

  return (
    <Card 
      className="mt-2 link-preview-card d-flex flex-row p-2"
      onClick={() => window.open(linkPreview.url, '_blank', 'noopener,noreferrer')}
      style={{ 
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        maxWidth: '100%',
      }}
    >
      {linkPreview.image && (
        <div className="flex-shrink-0 me-3" style={{ width: '100px', height: '100px' }}>
          <img
            src={linkPreview.image}
            alt="Link preview"
            className="rounded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
      
      <div className="flex-grow-1">
        <div className="d-flex flex-column h-100">
          <Card.Title className="mb-1" style={{ fontSize: '1rem', fontWeight: '600' }}>
            {linkPreview.title || 'Untitled Link'}
          </Card.Title>
          
          {linkPreview.description && (
            <Card.Text 
              className="text-muted mb-2" 
              style={{ 
                fontSize: '0.875rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {linkPreview.description}
            </Card.Text>
          )}
          
          <div className="mt-auto">
            <small 
              className="text-muted d-flex align-items-center" 
              style={{ fontSize: '0.75rem' }}
            >
              <span style={{ wordBreak: 'break-all' }}>
                {new URL(linkPreview.url).hostname.replace('www.', '')}
              </span>
            </small>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LinkPreviewCard;