import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/helpers/Message';
import Loader from '../../components/helpers/Loader';
import FormContainer from '../../components/application/FormContainer';
import { toast } from 'react-toastify';
import { useUpdateApplicationMutation, useGetApplicationDetailsQuery } from '../../slices/applicationsSlice';

function ApplicationEditScreen() {
  const { id: appId } = useParams();

  // State variables for application fields
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('');
  const [programmingLanguage, setProgrammingLanguage] = useState('');
  const [framework, setFramework] = useState('');
  const [database, setDatabase] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [price, setPrice] = useState(0);
  const [demoLink, setDemoLink] = useState('');
  const [documentationLink, setDocumentationLink] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [supportDetails, setSupportDetails] = useState({ type: '', duration: '' });
  const [features, setFeatures] = useState([]);
  const [previews, setPreviews] = useState([{ type: 'video', url: '' }]);
  const [authorDetails, setAuthorDetails] = useState({
    name: '',
    portfolioLink: '',
    lastUpdate: '',
    published: '',
    highResolution: false,
    compatibleBrowsers: [],
    compatibleWith: '',
    documentation: '',
    layout: '',
  });
  const [tags, setTags] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);

  // Fetch application details
  const { data: application, isLoading, refetch, error } = useGetApplicationDetailsQuery(appId);

  // Update application mutation
  const [updateApplication, { isLoading: loadingUpdate }] = useUpdateApplicationMutation();

 
  const navigate = useNavigate();

  // Populate state with application data when it's fetched
  useEffect(() => {
    if (application) {
      setName(application.name);
      setImage(application.image);
      setDescription(application.description);
      setPlatform(application.platform);
      setProgrammingLanguage(application.programmingLanguage);
      setFramework(application.framework);
      setDatabase(application.database);
      setLicenseType(application.licenseType);
      setPrice(application.price);
      setDemoLink(application.demoLink);
      setDocumentationLink(application.documentationLink);
      setGithubRepo(application.githubRepo);
      setSupportDetails(application.supportDetails || { type: '', duration: '' });
      setFeatures(application.features || []);
      setPreviews(application.previews || [{ type: 'video', url: '' }]);
      setAuthorDetails(application.authorDetails || {
        name: '',
        portfolioLink: '',
        lastUpdate: '',
        published: '',
        highResolution: false,
        compatibleBrowsers: [],
        compatibleWith: '',
        documentation: '',
        layout: '',
      });
      setTags(application.tags || []);
      setIsAvailable(application.isAvailable || false);
    }
  }, [application]);

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedApplication = {
        name,
        image,
        description,
        platform,
        programmingLanguage,
        framework,
        database,
        licenseType,
        price,
        demoLink,
        documentationLink,
        githubRepo,
        supportDetails,
        features,
        previews,
        authorDetails,
        tags,
        isAvailable,
      };

      await updateApplication({ appId, ...updatedApplication }).unwrap();
      toast.success('Application updated successfully');
      refetch();
      navigate('/admin/applicationlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Handle file upload
  const uploadImageHandler = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
      // headers will be set automatically by browser for FormData
    });

    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error || 'Upload failed');

    toast.success('Image uploaded successfully');
    setImage(data.url); // Update the image URL in state
  } catch (error) {
    toast.error(error.message);
  }
};

const uploadVideoHandler = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error || 'Upload failed');

    toast.success('Video uploaded successfully');
    setPreviews([{ type: 'video', url: data.url }]);
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <>
      <Link to='/admin/applicationlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1><strong>Edit Application</strong></h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            {/* Name */}
            <Form.Group controlId="name" className="my-3">
              <h5>Name</h5>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* Image */}
            <Form.Group controlId="image" className="my-3">
              <h5>Image</h5>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadImageHandler}
              />
            </Form.Group>

            {/* Description */}
            <Form.Group controlId="description" className="my-3">
              <h5>Description</h5>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
                </Form.Group>
                
              {/* Video */}
              <Form.Group controlId="video" className="my-3">
              <h5>Preview Video</h5>
              <Form.Control
                type="text"
                placeholder="Enter video URL"
                value={previews[0]?.url || ''}
                onChange={(e) =>
                  setPreviews([{ type: 'video', url: e.target.value }])
                }
              />
              <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadVideoHandler}
              />
            </Form.Group>

            {/* Platform */}
            <Form.Group controlId="platform" className="my-3">
              <h5>Platform</h5>
              <Form.Control
                type="text"
                placeholder="Enter platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            </Form.Group>

            {/* Programming Language */}
            <Form.Group controlId="programmingLanguage" className="my-3">
              <h5>Programming Language</h5>
              <Form.Control
                type="text"
                placeholder="Enter programming language"
                value={programmingLanguage}
                onChange={(e) => setProgrammingLanguage(e.target.value)}
              />
            </Form.Group>

            {/* Framework */}
            <Form.Group controlId="framework" className="my-3">
              <h5>Framework</h5>
              <Form.Control
                type="text"
                placeholder="Enter framework"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
              />
            </Form.Group>

            {/* Database */}
            <Form.Group controlId="database" className="my-3">
              <h5>Database</h5>
              <Form.Control
                type="text"
                placeholder="Enter database"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
              />
            </Form.Group>

            {/* License Type */}
            <Form.Group controlId="licenseType" className="my-3">
              <h5>License Type</h5>
              <Form.Control
                type="text"
                placeholder="Enter license type"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
              />
            </Form.Group>

            {/* Price */}
            <Form.Group controlId="price" className="my-3">
              <h5>Price</h5>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            {/* Demo Link */}
            <Form.Group controlId="demoLink" className="my-3">
              <h5>Demo Link</h5>
              <Form.Control
                type="text"
                placeholder="Enter demo link"
                value={demoLink}
                onChange={(e) => setDemoLink(e.target.value)}
              />
            </Form.Group>

            {/* Documentation Link */}
            <Form.Group controlId="documentationLink" className="my-3">
              <h5>Documentation Link</h5>
              <Form.Control
                type="text"
                placeholder="Enter documentation link"
                value={documentationLink}
                onChange={(e) => setDocumentationLink(e.target.value)}
              />
            </Form.Group>

            {/* GitHub Repo */}
            <Form.Group controlId="githubRepo" className="my-3">
              <h5>GitHub Repository</h5>
              <Form.Control
                type="text"
                placeholder="Enter GitHub repository"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
              />
            </Form.Group>

            {/* Support Details */}
            <Form.Group controlId="supportDetails" className="my-3">
              <h5>Support Details</h5>
              <Form.Control
                type="text"
                placeholder="Enter support type"
                value={supportDetails.type}
                onChange={(e) =>
                  setSupportDetails({ ...supportDetails, type: e.target.value })
                }
              />
              <Form.Control
                type="text"
                placeholder="Enter support duration"
                value={supportDetails.duration}
                onChange={(e) =>
                  setSupportDetails({ ...supportDetails, duration: e.target.value })
                }
              />
            </Form.Group>

            {/* Features */}
            <Form.Group controlId="features" className="my-3">
              <h5>Features</h5>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter features (comma-separated)"
                value={features.join(', ')}
                onChange={(e) => setFeatures(e.target.value.split(',').map(f => f.trim()))}
              />
            </Form.Group>

            {/* Author Details */}
            <Form.Group controlId="authorDetails" className="my-3">
              <h5><strong>Author Details</strong></h5>
              <Form.Label>Author Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author name"
                value={authorDetails.name}
                onChange={(e) =>
                  setAuthorDetails({ ...authorDetails, name: e.target.value })
                }
              />
              <Form.Label>Portfolio Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter portfolio link"
                value={authorDetails.portfolioLink}
                onChange={(e) =>
                  setAuthorDetails({ ...authorDetails, portfolioLink: e.target.value })
                }
              />
              <Form.Label>Last Update</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last update date"
                value={authorDetails.lastUpdate}
                onChange={(e) =>
                  setAuthorDetails({ ...authorDetails, lastUpdate: e.target.value })
                }
              />
              <Form.Label>Published Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter published date"
                value={authorDetails.published}
                onChange={(e) =>
                  setAuthorDetails({ ...authorDetails, published: e.target.value })
                }
              />
              <Form.Check
                type="checkbox"
                label="High Resolution"
                checked={authorDetails.highResolution}
                onChange={(e) =>
                  setAuthorDetails({ ...authorDetails, highResolution: e.target.checked })
                }
              />
              <Form.Label>Compatible Browsers</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter compatible browsers (comma-separated)"
                value={authorDetails.compatibleBrowsers.join(', ')}
                onChange={(e) =>
                  setAuthorDetails({
                    ...authorDetails,
                    compatibleBrowsers: e.target.value.split(',').map((browser) => browser.trim()),
                  })
                }
              />
              <Form.Label>Compatible With</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter compatible with"
                value={authorDetails.compatibleWith}
                onChange={(e) =>
                  setAuthorDetails({ ...authorDetails, compatibleWith: e.target.value })
                }
              />
              <Form.Label>Documentation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter documentation details"
                value={authorDetails.documentation}
                onChange={(e) =>
                  setAuthorDetails({ ...authorDetails, documentation: e.target.value })
                }
              />
              <Form.Label>Layout</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter layout details"
                value={authorDetails.layout}
                onChange={(e) =>
                  setAuthorDetails({ ...authorDetails, layout: e.target.value })
                }
              />
            </Form.Group>

            {/* Tags */}
            <Form.Group controlId="tags" className="my-3">
              <h5>Tags</h5>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter tags (comma-separated)"
                value={tags.join(', ')}
                onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
              />
            </Form.Group>

            {/* Availability */}
            <Form.Group controlId="isAvailable" className="my-3">
              <Form.Check
                type="checkbox"
                label="Is Available"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button type="submit" variant="primary" className="my-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default ApplicationEditScreen;