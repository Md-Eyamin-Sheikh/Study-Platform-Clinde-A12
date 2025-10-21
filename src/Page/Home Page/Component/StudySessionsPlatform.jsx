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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [studySessions, setStudySessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(6);

  // Fetch study sessions from API
  useEffect(() => {
    const fetchStudySessions = async () => {
      try {
        const response = await fetch('https://study-hub-survar-a12.vercel.app/data');
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
    const matchesSearch = (session.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || (session.category || '') === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

  // Show only 6 sessions by default or paginated sessions
  const displayedSessions = showAll ? filteredSessions : currentSessions;

  // Get unique categories
  const categories = ['all', ...new Set(studySessions.map(session => session.category || 'uncategorized').filter(Boolean))];

  const SessionCard = ({ session }) => {
    const status = getSessionStatus(session);
    const isOngoing = status === 'ongoing';

    return (
      <div className="bg-green-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
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
            <div className="flex items-center text-sm text-gray-950">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{session.tutorName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-950">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span>{session.averageRating}/5 ({session.totalReviews} reviews)</span>
            </div>
            <div className="flex items-center text-sm text-gray-900">
              <Clock className="w-4 h-4 mr-2" />
              <span>{session.sessionDuration}</span>
            </div>
            <div className="flex items-center text-sm text-gray-900">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className={session.registrationFee === 0 ? 'text-green-600 font-semibold' : ''}>
                {session.registrationFee === 0 ? 'Free' : `${session.registrationFee}`}
              </span>
            </div>
          </div>

          {/* Read More Button */}
          <Link to={`/details/${session._id}`}
            className="w-full  bg-green-500  text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
          >
            Read More
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100  to-green-50">
      {/* Header */}
      <div className="bg-green-100 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Available Study Sessions
            </h1>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Join expert-led study sessions and accelerate your learning journey with our collaborative platform
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 text-black py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white min-w-[200px]"
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
          {displayedSessions.map(session => (
            <SessionCard key={session._id} session={session} />
          ))}
        </div>

        {/* Pagination Controls */}
        {!showAll && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Show All Button */}
        {filteredSessions.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setShowAll(!showAll);
                setCurrentPage(1);
              }}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300"
            >
              {showAll ? 'Show Less' : `Show All Courses (${filteredSessions.length})`}
            </button>
          </div>
        )}

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
};

export default StudySessionsPlatform;