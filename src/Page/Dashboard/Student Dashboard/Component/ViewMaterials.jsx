import React, { useState, useEffect, useContext } from 'react';
import { Download, ExternalLink, ArrowLeft, FileText } from 'lucide-react';
import { AuthContext } from '../../../../providers/AuthProvider';

const ViewMaterials = () => {
  const { user } = useContext(AuthContext);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchBookedSessions();
    }
  }, [user]);

  const fetchBookedSessions = async () => {
    try {
      const response = await fetch(`https://study-hub-survar-a12-rtaxnv1a2-01775012014s-projects.vercel.app/api/student/booked-sessions/${user.email}`);
      const data = await response.json();
      
      if (data.success) {
        setBookedSessions(data.bookedSessions);
      }
    } catch (error) {
      console.error('Error fetching booked sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async (sessionId) => {
    try {
      const response = await fetch(`https://study-hub-survar-a12-rtaxnv1a2-01775012014s-projects.vercel.app/api/tutor/materials/all`);
      const data = await response.json();
      
      if (data.success) {
        // Filter materials by session ID
        const sessionMaterials = data.materials.filter(material => material.studySessionId === sessionId);
        setMaterials(sessionMaterials);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    fetchMaterials(session.studySessionId);
  };

  const handleDownload = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'study-material';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (selectedSession) {
    return (
      <div>
        <button
          onClick={() => setSelectedSession(null)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sessions
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Study Materials - {selectedSession.sessionDetails?.title || selectedSession.sessionTitle}
        </h2>

        {materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No study materials available for this session.
          </div>
        ) : (
          <div className="grid gap-6">
            {materials.map((material) => (
              <div key={material._id} className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{material.title}</h3>
                
                <p className="text-gray-600 mb-4">Uploaded by: {material.tutorEmail}</p>

                {/* Material Image */}
                {material.imageUrl && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                    <div className="border rounded-lg p-3">
                      <img
                        src={material.imageUrl}
                        alt={material.title}
                        className="w-full h-48 object-cover rounded mb-2"
                      />
                    </div>
                  </div>
                )}

                {/* Drive Link */}
                {material.driveLink && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Study Material</h4>
                    <div className="flex items-center justify-between border rounded p-3">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{material.title}</span>
                      </div>
                      <a
                        href={material.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Materials</h2>
      
      {bookedSessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No booked sessions found. Book a session to access study materials.
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-6">Select a session to view its study materials:</p>
          <div className="grid gap-4">
            {bookedSessions.map((session) => (
              <div
                key={session._id}
                onClick={() => handleSessionSelect(session)}
                className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {session.sessionDetails?.title || session.sessionTitle}
                </h3>
                <p className="text-gray-600 mb-1">Tutor: {session.tutorEmail}</p>
                <p className="text-sm text-gray-500">
                  Booked: {new Date(session.bookedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMaterials;
