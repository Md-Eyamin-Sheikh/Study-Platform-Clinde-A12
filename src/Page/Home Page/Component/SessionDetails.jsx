import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../providers/AuthProvider';
import {
  Calendar,
  Clock,
  User,
  Star,
  DollarSign,
  BookOpen,
  Users,
  MapPin,
  Award,
  ArrowLeft,
  CreditCard,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [session, setSession] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('student');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // First try to fetch by ID, if that fails, fetch all and find by string ID
        let sessionData = null;
        
        try {
          const sessionResponse = await fetch(`http://localhost:5000/data/${id}`);
          if (sessionResponse.ok) {
            sessionData = await sessionResponse.json();
          }
        } catch (error) {
          console.log('Direct fetch failed, trying to find in all sessions');
        }
        
        // If direct fetch failed, get all sessions and find the one with matching ID
        if (!sessionData) {
          const allSessionsResponse = await fetch(`http://localhost:5000/data`);
          if (allSessionsResponse.ok) {
            const allSessions = await allSessionsResponse.json();
            sessionData = allSessions.find(session => session._id === id || session.id === id);
          }
        }
        
        if (sessionData) {
          setSession(sessionData);
        }

        // Fetch booked sessions for current user
        if (isLoggedIn && user?.email) {
          try {
            const bookedResponse = await fetch(`http://localhost:5000/api/booked-sessions/${user.email}`);
            if (bookedResponse.ok) {
              const bookedData = await bookedResponse.json();
              if (bookedData.success) {
                setBookedSessions(bookedData.bookedSessions);
              }
            }
          } catch (error) {
            console.error('Error fetching booked sessions:', error);
          }
        }

        // Mock reviews data since API might not exist
        setReviews([]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchSessionData();
    }
  }, [id, isLoggedIn]);

  const handleBookSession = async (session) => {
    if (!isLoggedIn || userRole === 'admin' || userRole === 'tutor') {
      return;
    }

    try {
      const bookingData = {
        studentEmail: user?.email,
        studySessionId: session._id,
        tutorEmail: session.tutorEmail,
        sessionTitle: session.title,
        registrationFee: session.registrationFee
      };

      if (session.registrationFee > 0) {
        // For paid sessions, redirect to payment page
        // Store booking data in localStorage for payment page
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
        window.location.href = `/payment?sessionId=${session._id}&fee=${session.registrationFee}`;
      } else {
        // For free sessions, book directly
        const response = await fetch('http://localhost:5000/api/book-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.success) {
          alert(`Successfully booked: ${session.title}!`);
          setBookedSessions([...bookedSessions, session._id]);
        } else {
          alert(result.message || 'Failed to book session. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error booking session:', error);
      alert('An error occurred while booking the session.');
    }
  };

  const setCurrentPage = (page) => {
    if (page === 'sessions') {
      navigate('/');
    }
  };

  const getSessionStatus = (session) => {
    if (!session || !session.registrationStartDate || !session.registrationEndDate) {
      return 'closed';
    }
    const now = new Date();
    const regStart = new Date(session.registrationStartDate);
    const regEnd = new Date(session.registrationEndDate);

    return now >= regStart && now <= regEnd ? 'ongoing' : 'closed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-xl mt-4">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
            <h2 className="text-2xl font-bold text-whait mb-4">Session not found</h2>
            <p className="">The session you are looking for does not exist or could not be loaded.</p>
            <Link to="/"
              className="inline-block mt-6  text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              Back to Sessions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = getSessionStatus(session);
  const isOngoing = status === 'ongoing';
  const canBook = isLoggedIn && userRole === 'student' && isOngoing && !bookedSessions.includes(session._id);
  const sessionReviews = reviews.filter(review => 
    review.studySessionId === session._id || review.studySessionId === session.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-700 text-white p-8">
            <button
              onClick={() => setCurrentPage('sessions')}
              className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sessions
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{session.title}</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-900" />
                <span className="text-lg text-gray-900">{session.tutorName}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-300" />
                <span>{session.averageRating}/5 ({session.totalReviews} reviews)</span>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isOngoing 
                  ? 'bg-green-500/20 text-green-100' 
                  : 'bg-red-500/20 text-red-100'
              }`}>
                {isOngoing ? 'Registration Open' : 'Registration Closed'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{session.description}</p>
            </div>

            {/* Session Details Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Session Information</h3>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-900">Registration Period</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(session.registrationStartDate).toLocaleDateString()} - {new Date(session.registrationEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-900">Class Duration</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(session.classStartTime).toLocaleDateString()} - {new Date(session.classEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-800">Duration</p>
                    <p className="font-semibold text-gray-900">{session.sessionDuration}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-800">Location</p>
                    <p className="font-semibold text-gray-900">{session.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing & Enrollment</h3>
                
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-800">Registration Fee</p>
                    <p className={`text-2xl font-bold text-gray-900${session.registrationFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {session.registrationFee === 0 ? 'Free' : `$${session.registrationFee}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-800">Enrollment</p>
                    <p className="font-semibold text-gray-900">{session.currentStudents}/{session.maxStudents} students</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 text-gray-900 rounded-full transition-all duration-300"
                        style={{ width: `${(session.currentStudents / session.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3  text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-800">Level</p>
                    <p className="font-semibold text-gray-900">{session.level}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {session.requirements && session.requirements.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {session.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Book Now Button */}
            <div className="mb-8">
              {canBook ? (
                <button
                  onClick={() => handleBookSession(session)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center"
                >
                  {session.registrationFee > 0 ? (
                    <>
                      <CreditCard className="w-6 h-6 mr-2 text-gray-900" />
                      Book Now - ${session.registrationFee}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 text-gray-900 mr-2" />
                      Book Now - Free
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-400 text-white px-8 py-4 rounded-xl font-bold text-lg cursor-not-allowed flex items-center"
                >
                  <XCircle className="w-6 h-6 mr-2" />
                  {!isLoggedIn ? 'Login Required' : 
                   userRole !== 'student' ? 'Students Only' : 
                   bookedSessions.includes(session._id) ? 'Already Booked' :
                   'Registration Closed'}
                </button>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="w-6 h-6 mr-3 text-green-600" />
                Student Reviews ({sessionReviews.length})
              </h3>
              
              {sessionReviews.length > 0 ? (
                <div className="space-y-6">
                  {sessionReviews.map(review => (
                    <div key={review._id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                            {review.studentName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-semibold text-gray-900">{review.studentName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this session!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;