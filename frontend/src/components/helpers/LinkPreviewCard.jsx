import { Card } from 'react-bootstrap';

const LinkPreviewCard = ({ linkPreview }) => {
  if (!linkPreview?.url) return null;

  return (
    <Card 
      className="mt-2 link-preview-card"
      onClick={() => window.open(linkPreview.url, '_blank', 'noopener,noreferrer')}
      style={{ 
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      {linkPreview.image && (
        <Card.Img
          variant="top"
          src={linkPreview.image}
          alt="Link preview"
          style={{
            maxHeight: '150px',
            objectFit: 'cover',
            width: '100%',
          }}
        />
      )}
      <Card.Body>
        <Card.Title>{linkPreview.title || 'Untitled Link'}</Card.Title>
        {linkPreview.description && (
          <Card.Text>{linkPreview.description}</Card.Text>
        )}
        <div className="mt-2">
          <small className="text-muted" style={{ wordBreak: 'break-all' }}>
            {new URL(linkPreview.url).hostname.replace('www.', '')}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LinkPreviewCard;