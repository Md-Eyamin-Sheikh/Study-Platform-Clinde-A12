import React, { useState, useEffect } from 'react';
import { useParams, useNavigate ,Link} from 'react-router-dom';
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

const DetalsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('student');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`http://localhost:5000/data/${id}`);
        const data = await response.json();
        setSession(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching session:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchSession();
    }
  }, [id]);

  const handleBookSession = (session) => {
    if (!isLoggedIn || userRole === 'admin' || userRole === 'tutor') {
      return;
    }

    if (session.registrationFee > 0) {
      alert('Redirect to payment page');
    } else {
      alert(`Successfully booked: ${session.title}!`);
    }
  };

  const setCurrentPage = (page) => {
    if (page === 'sessions') {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Session not found</h2>
            <p className="text-gray-600">The session you are looking for does not exist or could not be loaded.</p>
            <Link to="/"
              onClick={() => setCurrentPage('sessions')}
              className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sessions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const SessionDetails = ({ session, reviews, isLoggedIn, userRole, bookedSessions, handleBookSession, setCurrentPage }) => {
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Session not found</h2>
        <p className="text-gray-600">The session you are looking for does not exist or could not be loaded.</p>
        <button
          onClick={() => setCurrentPage && setCurrentPage('sessions')}
          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Sessions
        </button>
      </div>
    );
  }

  const getSessionStatus = (session) => {
    if (!session || !session.registrationStartDate || !session.registrationEndDate) {
      return 'closed';
    }
    const now = new Date();
    const regStart = new Date(session.registrationStartDate);
    const regEnd = new Date(session.registrationEndDate);

    return now >= regStart && now <= regEnd ? 'ongoing' : 'closed';
  };

  const status = getSessionStatus(session);
  const isOngoing = status === 'ongoing';
  const canBook = isLoggedIn && userRole === 'student' && isOngoing && !bookedSessions.includes(session.id);
  const sessionReviews = reviews.filter(review => review.studySessionId === session.id || review.studySessionId === session._id);

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <button
            onClick={() => setCurrentPage('sessions')}
            className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Sessions
          </button>
          
          <h1 className="text-3xl font-bold mb-4">{session.title}</h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span className="text-lg">{session.tutorName}</span>
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
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Registration Period</p>
                  <p className="font-semibold">
                    {new Date(session.registrationStartDate).toLocaleDateString()} - {new Date(session.registrationEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Class Duration</p>
                  <p className="font-semibold">
                    {new Date(session.classStartTime).toLocaleDateString()} - {new Date(session.classEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">{session.sessionDuration}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{session.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing & Enrollment</h3>
              
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Registration Fee</p>
                  <p className={`text-2xl font-bold ${session.registrationFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {session.registrationFee === 0 ? 'Free' : `$${session.registrationFee}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Enrollment</p>
                  <p className="font-semibold">{session.currentStudents}/{session.maxStudents} students</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(session.currentStudents / session.maxStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Award className="w-5 h-5 mr-3 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-semibold">{session.level}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          {session.requirements && (
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
                    <CreditCard className="w-6 h-6 mr-2" />
                    Book Now - ${session.registrationFee}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 mr-2" />
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
                 'Registration Closed'}
              </button>
            )}
          </div>

          {/* Reviews Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
              Student Reviews ({sessionReviews.length})
            </h3>
            
            {sessionReviews.length > 0 ? (
              <div className="space-y-6">
                {sessionReviews.map(review => (
                  <div key={review._id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
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
  );

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <SessionDetails session={session} reviews={reviews} isLoggedIn={isLoggedIn} userRole={userRole} bookedSessions={[]} handleBookSession={handleBookSession} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default DetalsPage;