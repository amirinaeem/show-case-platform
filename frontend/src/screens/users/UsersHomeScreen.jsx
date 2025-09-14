import { useEffect, useState } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { useGetUsersQuery } from '../../slices/usersApiSlice';

function UsersHomeScreen() {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);

  useEffect(() => {
    if (users.length) {
      const online = users.filter(u => u.isOnline);
      const offline = users.filter(u => !u.isOnline);
      setOnlineUsers(online);
      setOfflineUsers(offline);
    }
  }, [users]);

  
  const topUsers = users.slice(0, 2);

  const renderTopUser = (user) => (
    <Card key={user._id} className="top-user-card mb-3 shadow-sm">
      <div className="d-flex flex-column align-items-center p-3">
        <Image
          src={user.avatar || '/images/logo.jpg'}
          roundedCircle
          width="100"
          height="100"
                  className="mb-3"
                  style={{
                    border: '2px solid rgb(132, 147, 172)', 
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                  }}
        />
        <h5 className="fw-bold">{user.name}</h5>
        <p className="text-center small text-muted">
          {user.bio || `${user.name} recently joined. Say hello!`}
        </p>
        <div className="d-flex gap-2">
          <Button variant="secondary" size="sm">Connect</Button>
          <Button variant="outline-primary" size="sm">View Profile</Button>
        </div>
      </div>
    </Card>
  );

  const renderUserRows = (userList) => {
    const rows = [];
    for (let i = 0; i < userList.length; i += 5) {
      // First row of 3 users
      const firstRow = userList.slice(i, i + 3);
      // Second row of 2 users
      const secondRow = userList.slice(i + 3, i + 5);
      
      rows.push(
        <div key={`row-${i}`} className="d-flex justify-content-center mb-3">
          {firstRow.map(user => (
            <div key={user._id} className="mx-2">
              <Image
              src={user.avatar || '/images/logo.jpg'}
              roundedCircle
              width="45"
              height="45"
              style={{
              border: '2px solid rgb(132, 147, 172)', 
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
              }}
/>
            </div>
          ))}
        </div>
      );
      
      if (secondRow.length > 0) {
        rows.push(
          <div key={`row-${i}-2`} className="d-flex justify-content-center mb-3">
            {secondRow.map(user => (
              <div key={user._id} className="mx-2">
                <Image
                src={user.avatar || '/images/logo.jpg'}
                roundedCircle
                width="45"
                height="45"
                style={{
                 border: '2px solid rgb(140, 157, 183)', 
                 boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                }}
               />
              </div>
            ))}
          </div>
        );
      }
    }
    return rows;
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <div className="container mt-3">
      
      {/* Top Users Section */}
      <div className="mb-5">
        <Card.Header className="bg-white mb-3 p-2">
          <strong>Top Users</strong>
        </Card.Header>
        <Card className="shadow-sm border-0 bg-white">
          <Card.Body className="d-flex flex-column">
            {topUsers.length > 0 ? topUsers.map(renderTopUser) : <div>No top users found.</div>}
          </Card.Body>
        </Card>
      </div>
  
      {/* All Users Section */}
      <div className="mb-5">
        <Card.Header className="bg-white mb-3 p-2">
          <strong>All Users</strong>
        </Card.Header>
        <Card className="shadow-sm border-0 bg-white">
          <Card.Body className="p-3">
            <div className="bg-light fw-bold px-3 py-2 mb-3">Online</div>
            {renderUserRows(onlineUsers)}
            
            <div className="bg-light fw-bold px-3 py-2 mb-3 mt-4">Offline</div>
            {renderUserRows(offlineUsers)}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default UsersHomeScreen;