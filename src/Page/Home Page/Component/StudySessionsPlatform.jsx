import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  User,
  Star,
  DollarSign,
  BookOpen,
  ChevronRight,
  Filter,
  Search,

} from 'lucide-react';


const StudySessionsPlatform = () => {
  const [currentPage, setCurrentPage] = useState('sessions');
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [studySessions, setStudySessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [userRole, setUserRole] = useState('student');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Fetch study sessions from API
  useEffect(() => {
    const fetchStudySessions = async () => {
      try {
        const response = await fetch('http://localhost:5000/data');
        const data = await response.json();
        setStudySessions(data);
        setLoadingSessions(false);
      } catch (error) {
        console.error('Error fetching study sessions:', error);
        setLoadingSessions(false);
      }
    };

    fetchStudySessions();
  }, []);
  

  // Check if session is ongoing or closed
  const getSessionStatus = (session) => {
    const now = new Date();
    const regStart = new Date(session.registrationStartDate);
    const regEnd = new Date(session.registrationEndDate);
    
    return now >= regStart && now <= regEnd ? 'ongoing' : 'closed';
  };

  // Filter approved sessions only
  const approvedSessions = studySessions.filter(session => session.status === 'approved');

  // Apply search and filter
  const filteredSessions = approvedSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || session.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(studySessions.map(session => session.category))];

  const handleReadMore = (session) => {
    setSelectedSession(session);
    setCurrentPage('details');
  };

  const handleBookSession = (session) => {
    if (!isLoggedIn || userRole === 'admin' || userRole === 'tutor') {
      return;
    }

    if (session.registrationFee > 0) {
      // Redirect to payment page
      setCurrentPage('payment');
    } else {
      // Book directly for free sessions
      // Here you would normally save to "bookedSession" collection
      alert(`Successfully booked: ${session.title}!`);
    }
  };

  const SessionCard = ({ session }) => {
    const status = getSessionStatus(session);
    const isOngoing = status === 'ongoing';

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
        <div className="p-6">
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isOngoing 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isOngoing ? 'Ongoing' : 'Closed'}
            </span>
            <span className="text-2xl">{session.category === 'Programming' ? '💻' : session.category === 'Design' ? '🎨' : '📊'}</span>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            {session.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {session.description}
          </p>

          {/* Session Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{session.tutorName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span>{session.averageRating}/5 ({session.totalReviews} reviews)</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>{session.sessionDuration}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className={session.registrationFee === 0 ? 'text-green-600 font-semibold' : ''}>
                {session.registrationFee === 0 ? 'Free' : `$${session.registrationFee}`}
              </span>
            </div>
          </div>

          {/* Read More Button */}
          <Link to={`/details/${session._id}`}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
          >
            Read More
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  };

  

  const SessionsList = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Available Study Sessions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join expert-led study sessions and accelerate your learning journey with our collaborative platform
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white min-w-[200px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map(session => (
            <SessionCard key={session._id} session={session} />
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );

  // Main render logic
  return (
    <div className="font-sans">
      {currentPage === 'sessions' && <SessionsList />}
      {currentPage === 'details' && selectedSession && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <SessionDetails session={selectedSession} reviews={reviews} isLoggedIn={isLoggedIn} userRole={userRole} bookedSessions={[]} handleBookSession={handleBookSession} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessionsPlatform;