'use client';

import { useState, useEffect } from 'react';
import type { ThanksgivingTask } from '@/types';
import { brand } from '@/lib/brand';

export default function ThanksgivingPlanningPage() {
  const [tasks, setTasks] = useState<ThanksgivingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<{ taskId: string; action: 'assign' | 'remove', volunteerId?: string, isLead?: boolean } | null>(null);
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    notes: ''
  });
  const [addSlotTaskId, setAddSlotTaskId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Mobile coordinator features
  const [searchQuery, setSearchQuery] = useState('');
  const [showJumpMenu, setShowJumpMenu] = useState(false);
  const [showStatsExpanded, setShowStatsExpanded] = useState(true);
  const [filterUnfilledOnly, setFilterUnfilledOnly] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Escape key handler for modal and search
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedTask) {
          setSelectedTask(null);
          setVolunteerForm({ name: '', notes: '' });
          setErrorMessage(null);
        }
        if (showSearchResults) {
          setShowSearchResults(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedTask, showSearchResults]);

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const searchInput = document.getElementById('volunteer-search');
      if (showSearchResults && !target.closest('.search-results-dropdown') && target !== searchInput) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchResults]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/thanksgiving-planning');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch('/api/thanksgiving-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          lead: task.lead || '',
          volunteers: task.volunteers,
          slotsNeeded: task.slotsNeeded + 1,
          notes: task.notes || '',
          updatedBy: 'thanksgiving-coordinator',
        }),
      });

      if (response.ok) {
        setSuccessMessage('Slot added successfully!');
        await fetchTasks();
        setAddSlotTaskId(null);
        setTimeout(() => setSuccessMessage(null), 4500);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to add slot. Please try again.');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    } catch (error) {
      console.error('Error adding slot:', error);
      setErrorMessage('An error occurred. Please try again.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name is not empty/whitespace
    const trimmedName = volunteerForm.name.trim();
    if (!trimmedName || trimmedName.length === 0) {
      setErrorMessage('Please enter a valid volunteer name.');
      return;
    }
    
    // Validate name length
    if (trimmedName.length > 100) {
      setErrorMessage('Volunteer name is too long (max 100 characters).');
      return;
    }

    if (!selectedTask) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const task = tasks.find(t => t.id === selectedTask.taskId);
      if (!task) return;
      
      // If assigning as lead
      if (selectedTask.isLead) {
        const response = await fetch('/api/thanksgiving-planning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: task.id,
            lead: trimmedName,
            volunteers: task.volunteers,
            notes: volunteerForm.notes || task.notes || '',
            updatedBy: 'thanksgiving-coordinator',
          }),
        });

        if (response.ok) {
          setSuccessMessage(`${trimmedName} has been assigned as lead!`);
          await fetchTasks();
          setSelectedTask(null);
          setVolunteerForm({ name: '', notes: '' });
          setTimeout(() => setSuccessMessage(null), 4500);
        } else {
          const data = await response.json();
          setErrorMessage(data.error || 'Failed to assign lead. Please try again.');
          setTimeout(() => setErrorMessage(null), 5000);
        }
        return;
      }
      
      // Check for duplicates (case-insensitive)
      const isDuplicate = task.volunteers.some(
        v => v.toLowerCase() === trimmedName.toLowerCase()
      );
      
      if (isDuplicate) {
        setErrorMessage(`${trimmedName} is already signed up for this task.`);
        setIsSubmitting(false);
        return;
      }
      
      // Check if task is full
      if (task.volunteers.length >= task.slotsNeeded) {
        setErrorMessage('This task is already full. Please refresh the page.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/thanksgiving-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          lead: task.lead || '',
          volunteers: [...task.volunteers, trimmedName],
          notes: volunteerForm.notes || task.notes || '',
          updatedBy: 'thanksgiving-coordinator',
        }),
      });

      if (response.ok) {
        setSuccessMessage(`${trimmedName} has been assigned successfully!`);
        await fetchTasks();
        setSelectedTask(null);
        setVolunteerForm({ name: '', notes: '' });
        setTimeout(() => setSuccessMessage(null), 4500);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to assign volunteer. Please try again.');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    } catch (error) {
      console.error('Error assigning volunteer:', error);
      setErrorMessage('An error occurred. Please try again.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveVolunteer = async (taskId: string, volunteerName: string) => {
    // Confirm before removing
    const confirmed = window.confirm(
      `Are you sure you want to remove ${volunteerName} from this task?`
    );
    
    if (!confirmed) return;
    
    setErrorMessage(null);
    
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const response = await fetch('/api/thanksgiving-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          lead: task.lead || '',
          volunteers: task.volunteers.filter(v => v !== volunteerName),
          notes: task.notes || '',
          updatedBy: 'thanksgiving-coordinator',
        }),
      });

      if (response.ok) {
        setSuccessMessage(`${volunteerName} has been removed.`);
        await fetchTasks();
        setTimeout(() => setSuccessMessage(null), 4500);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to remove volunteer. Please try again.');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    } catch (error) {
      console.error('Error removing volunteer:', error);
      setErrorMessage('An error occurred while removing volunteer. Please try again.');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const selectedTaskData = selectedTask ? tasks.find(t => t.id === selectedTask.taskId) : null;

  // Search and filter logic
  const searchLower = searchQuery.toLowerCase().trim();
  
  // Collect volunteer name matches with their tasks
  const volunteerMatches: Array<{ name: string; role: 'lead' | 'volunteer'; task: ThanksgivingTask }> = [];
  if (searchLower) {
    tasks.forEach(task => {
      // Check lead
      if (task.lead && task.lead.toLowerCase().includes(searchLower)) {
        volunteerMatches.push({ name: task.lead, role: 'lead', task });
      }
      // Check volunteers
      task.volunteers.forEach(volunteer => {
        if (volunteer.toLowerCase().includes(searchLower)) {
          volunteerMatches.push({ name: volunteer, role: 'volunteer', task });
        }
      });
    });
  }

  const matchesSearch = (task: ThanksgivingTask) => {
    if (!searchLower) return true;
    const leadMatch = task.lead?.toLowerCase().includes(searchLower);
    const volunteerMatch = task.volunteers.some(v => v.toLowerCase().includes(searchLower));
    const taskMatch = task.task.toLowerCase().includes(searchLower);
    return leadMatch || volunteerMatch || taskMatch;
  };

  const matchesFilters = (task: ThanksgivingTask) => {
    if (filterUnfilledOnly) {
      const totalFilled = task.volunteers.length + (task.lead ? 1 : 0);
      const totalNeeded = task.slotsNeeded + (task.lead ? 1 : 0);
      return totalFilled < totalNeeded;
    }
    return true;
  };

  // Separate Buffet Service tasks for special rendering
  const buffetServiceTasks = tasks.filter(t => t.day === 'Thursday' && t.section === 'Buffet Service' && matchesSearch(t) && matchesFilters(t));
  
  // Helper function to convert time string to minutes for proper chronological sorting
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  // Order buffet tasks: Turkeys first, then sides
  const orderedBuffetTasks = [...buffetServiceTasks].sort((a, b) => {
    // Turkey items first
    const aIsTurkey = a.task.toLowerCase().includes('turkey');
    const bIsTurkey = b.task.toLowerCase().includes('turkey');
    
    if (aIsTurkey && !bIsTurkey) return -1;
    if (!aIsTurkey && bIsTurkey) return 1;
    
    // Within same category, sort by task name
    return a.task.localeCompare(b.task);
  });
  
  const wednesdayTasks = tasks.filter(t => t.day === 'Wednesday' && t.section !== 'Extras' && matchesSearch(t) && matchesFilters(t)).sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  const thursdayTasks = tasks.filter(t => t.day === 'Thursday' && t.section !== 'Extras' && t.section !== 'Buffet Service' && matchesSearch(t) && matchesFilters(t)).sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  const wednesdayExtras = tasks.filter(t => t.day === 'Wednesday' && t.section === 'Extras').sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  const thursdayExtras = tasks.filter(t => t.day === 'Thursday' && t.section === 'Extras').sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  // Search result count
  const searchResultCount = searchLower ? volunteerMatches.length : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: brand.color.teal }}></div>
          <p className="text-gray-600">Loading volunteer schedule...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .thanksgiving-page {
          font-size: 16px;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          line-height: 1.5;
        }
        .thanksgiving-page button {
          min-height: auto !important;
          min-width: auto !important;
          transform: none !important;
          box-shadow: none !important;
          font-size: 0.75rem !important;
          line-height: 1.2 !important;
          padding: 0.25rem 0.75rem !important;
        }
        .thanksgiving-page button:hover {
          transform: none !important;
          box-shadow: none !important;
        }

        /* Print Styles - Optimized for Portrait B&W */
        @media print {
          @page {
            size: portrait;
            margin: 0.5in;
          }
          
          /* Remove backgrounds and optimize for B&W */
          * {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          /* Hide interactive elements */
          .no-print,
          button:not(.volunteer-name-print),
          input,
          textarea,
          .search-results-dropdown,
          svg:not(.print-icon) {
            display: none !important;
          }
          
          /* Optimize layout */
          main {
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
          }
          
          /* Cards and containers */
          .bg-white, .rounded-lg, .shadow-lg, .shadow-md {
            border: 1px solid #333 !important;
            page-break-inside: avoid;
            margin-bottom: 0.25in !important;
            padding: 0.15in !important;
          }
          
          /* Header styling */
          h2, h3 {
            font-size: 14pt !important;
            font-weight: bold !important;
            border-bottom: 2px solid #000 !important;
            padding-bottom: 2pt !important;
            margin-bottom: 6pt !important;
          }
          
          /* Task cards */
          .border {
            border: 1px solid #666 !important;
            margin-bottom: 8pt !important;
            padding: 6pt !important;
          }
          
          /* Text sizing for readability */
          p, span, div {
            font-size: 9pt !important;
            line-height: 1.3 !important;
          }
          
          .font-semibold {
            font-weight: bold !important;
          }
          
          /* Volunteer names */
          .volunteer-name-print {
            border: 1px solid #000 !important;
            padding: 2pt 4pt !important;
            margin: 2pt !important;
            display: inline-block !important;
            font-size: 8pt !important;
          }
          
          /* Complete badges */
          .bg-green-200, .bg-green-50 {
            border: 2px solid #000 !important;
            background: white !important;
            font-weight: bold !important;
          }
          
          /* Compact spacing */
          .space-y-3, .space-y-4, .space-y-6 {
            margin-top: 4pt !important;
            margin-bottom: 4pt !important;
          }
          
          /* Gap adjustments */
          .gap-2, .gap-3, .gap-4 {
            gap: 2pt !important;
          }
          
          /* Logo sizing */
          img {
            max-width: 1.5in !important;
            height: auto !important;
          }
          
          /* Stats and compact info */
          .text-xs {
            font-size: 7pt !important;
          }
          
          /* Ensure page breaks work well */
          .bg-gradient-to-br {
            background: white !important;
          }
          
          /* Day sections */
          h3.text-2xl, h3.text-xl {
            page-break-after: avoid !important;
            margin-top: 0.2in !important;
          }
          
          /* Buffet service master card */
          .border-4 {
            border: 2px solid #000 !important;
            page-break-inside: avoid;
          }
        }
      `}} />
      <main 
        className="min-h-screen bg-linear-to-br from-teal-50 to-cyan-100 thanksgiving-page" 
        style={{ 
          fontSize: '16px',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          lineHeight: '1.5'
        }}
      >
        {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-100 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {/* Error Message Toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-100 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)}
              className="ml-2 hover:bg-red-700 rounded p-1"
              style={{ 
                minHeight: 'unset',
                minWidth: 'unset',
                transform: 'none',
                boxShadow: 'none'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Add Slot Confirmation Modal */}
      {addSlotTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Add Volunteer Slot
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This will add one more volunteer position to <strong>{tasks.find(t => t.id === addSlotTaskId)?.task}</strong>. 
              The new slot will be empty and ready to assign a volunteer.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleAddSlot(addSlotTaskId)}
                disabled={isSubmitting}
                className="flex-1 text-white py-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: brand.color.teal,
                  minHeight: 'unset',
                  minWidth: 'unset',
                  transform: 'none',
                  boxShadow: 'none'
                }}
              >
                {isSubmitting ? 'Adding...' : 'Add Slot'}
              </button>
              <button
                onClick={() => setAddSlotTaskId(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                style={{ 
                  minHeight: 'unset',
                  minWidth: 'unset',
                  transform: 'none',
                  boxShadow: 'none'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {selectedTask && selectedTaskData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedTask.isLead ? 'Assign lead for' : 'Assign volunteer for'} {selectedTaskData.task}
            </h3>
            
            {/* Status Info Box */}
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${brand.color.teal}15`, border: `1px solid ${brand.color.teal}` }}>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Time:</span>
                  <span style={{ color: brand.color.ink }}>{selectedTaskData.day} at {selectedTaskData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Volunteers:</span>
                  {selectedTaskData.volunteers.length >= selectedTaskData.slotsNeeded ? (
                    <span className="text-green-700 font-semibold">✓ Filled ({selectedTaskData.volunteers.length}/{selectedTaskData.slotsNeeded})</span>
                  ) : (
                    <span className="text-orange-600 font-semibold">{selectedTaskData.volunteers.length}/{selectedTaskData.slotsNeeded} assigned</span>
                  )}
                </div>
                {selectedTaskData.lead && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Lead:</span>
                    <span style={{ color: brand.color.ink }}>{selectedTaskData.lead}</span>
                  </div>
                )}
              </div>
            </div>
            
            <form onSubmit={handleAssignVolunteer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedTask.isLead ? 'Lead Name *' : 'Volunteer Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={volunteerForm.name}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder={selectedTask.isLead ? "Enter lead name" : "Enter volunteer name"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={volunteerForm.notes}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  placeholder="Special instructions or notes"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || (!selectedTask.isLead && selectedTaskData.volunteers.length >= selectedTaskData.slotsNeeded)}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    isSubmitting || (!selectedTask.isLead && selectedTaskData.volunteers.length >= selectedTaskData.slotsNeeded)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={{ 
                    backgroundColor: isSubmitting || (!selectedTask.isLead && selectedTaskData.volunteers.length >= selectedTaskData.slotsNeeded) ? undefined : brand.color.teal,
                    minHeight: 'unset',
                    minWidth: 'unset',
                    transform: 'none',
                    boxShadow: 'none'
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Assigning...
                    </span>
                  ) : selectedTask.isLead ? (
                    'Assign Lead'
                  ) : (
                    'Assign Volunteer'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTask(null);
                    setVolunteerForm({ name: '', notes: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  style={{ 
                    minHeight: 'unset',
                    minWidth: 'unset',
                    transform: 'none',
                    boxShadow: 'none'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Senior Center Logo at Top */}
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Ukiah Senior Center" 
            className="w-48 md:w-56 h-auto"
          />
        </div>

        {/* Header Card - Separate from task list like liturgists */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center" style={{ margin: 0 }}>
                <svg className="w-6 h-6 mr-2" style={{ color: brand.color.teal }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Thanksgiving Volunteer Schedule
              </h2>
              <p className="text-xs text-gray-500 ml-8" style={{ marginTop: '4px' }}>
                Click any task to assign volunteers
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="no-print flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              style={{
                minHeight: 'auto',
                minWidth: 'auto',
                transform: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Schedule
            </button>
          </div>
        </div>

        {/* Mobile Coordinator Tools - Search & Filter */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          {/* Search Bar */}
          <div className="mb-3 relative">
            <label htmlFor="volunteer-search" className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Search Volunteers or Tasks
            </label>
            <div className="relative">
              <input
                id="volunteer-search"
                type="text"
                placeholder="Type a name or task..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.trim().length > 0);
                }}
                onFocus={() => searchQuery.trim().length > 0 && setShowSearchResults(true)}
                className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all"
                style={{ fontSize: '16px' }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  style={{ 
                    minHeight: 'unset',
                    minWidth: 'unset',
                    transform: 'translateY(-50%)',
                    boxShadow: 'none'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && volunteerMatches.length > 0 && (
              <div className="search-results-dropdown absolute z-50 w-full mt-2 bg-white border-2 border-teal-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-gray-500 font-semibold px-2 py-1 mb-1">
                    Found {volunteerMatches.length} assignment{volunteerMatches.length !== 1 ? 's' : ''} - Click to jump
                  </p>
                  {volunteerMatches.map((match, idx) => (
                    <button
                      key={`${match.task.id}-${match.name}-${idx}`}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                        setTimeout(() => {
                          document.getElementById(`task-${match.task.id}`)?.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                          });
                        }, 100);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-teal-50 transition-colors group"
                      style={{ 
                        minHeight: 'unset',
                        minWidth: 'unset',
                        transform: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {match.name}
                            {match.role === 'lead' && (
                              <span className="ml-2 text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">LEAD</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {match.task.day} • {match.task.time} • {match.task.task}
                          </p>
                          <p className="text-xs text-gray-500">{match.task.section}</p>
                        </div>
                        <svg className="w-4 h-4 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && volunteerMatches.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 font-medium">
                No volunteers found matching "{searchQuery}"
              </p>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterUnfilledOnly(!filterUnfilledOnly)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterUnfilledOnly
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ 
                minHeight: 'unset',
                minWidth: 'unset',
                transform: 'none',
                boxShadow: 'none'
              }}
            >
              {filterUnfilledOnly ? '✓ ' : ''}Unfilled Only
            </button>
            <button
              onClick={() => setShowJumpMenu(true)}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-teal-100 text-teal-700 hover:bg-teal-200 transition-all"
              style={{ 
                minHeight: 'unset',
                minWidth: 'unset',
                transform: 'none',
                boxShadow: 'none'
              }}
            >
              📍 Jump to Section
            </button>
            <button
              onClick={() => setShowStatsExpanded(!showStatsExpanded)}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all ml-auto"
              style={{ 
                minHeight: 'unset',
                minWidth: 'unset',
                transform: 'none',
                boxShadow: 'none'
              }}
            >
              {showStatsExpanded ? '📊 Hide Stats' : '📊 Show Stats'}
            </button>
          </div>
        </div>

        {/* Summary Stats - Modern Pills (Collapsible) */}
        {showStatsExpanded && (
        <div className="bg-linear-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Total Slots Pill */}
            <div className="bg-white rounded-full px-6 py-3 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color.teal }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">TOTAL SLOTS</p>
                <p className="text-2xl font-bold" style={{ color: brand.color.teal }}>
                  {tasks.reduce((sum, t) => sum + t.slotsNeeded + (t.lead ? 1 : 0), 0)}
                </p>
              </div>
            </div>

            {/* Filled Pill */}
            <div className="bg-white rounded-full px-6 py-3 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">FILLED</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.reduce((sum, t) => sum + t.volunteers.length + (t.lead ? 1 : 0), 0)}
                </p>
              </div>
            </div>

            {/* Open Pill */}
            <div className="bg-white rounded-full px-6 py-3 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">OPEN</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tasks.reduce((sum, t) => sum + t.slotsNeeded + (t.lead ? 1 : 0), 0) - tasks.reduce((sum, t) => sum + t.volunteers.length + (t.lead ? 1 : 0), 0)}
                </p>
              </div>
            </div>

            {/* Completion Pill */}
            <div className="bg-white rounded-full px-6 py-3 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color.teal }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">COMPLETE</p>
                <p className="text-2xl font-bold" style={{ color: brand.color.teal }}>
                  {Math.round((tasks.reduce((sum, t) => sum + t.volunteers.length + (t.lead ? 1 : 0), 0) / tasks.reduce((sum, t) => sum + t.slotsNeeded + (t.lead ? 1 : 0), 0)) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Wednesday Tasks */}
        {wednesdayTasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-3" style={{ margin: 0, marginBottom: '12px' }}>
              <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: brand.color.teal}}></span>
              Wednesday, November 27
            </h3>

            {/* Extras/Misc Card for Wednesday */}
            {wednesdayExtras.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mb-3">
                <h4 className="font-semibold text-purple-900 flex items-center mb-2" style={{ fontSize: '0.95rem' }}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Misc / Extras
                </h4>
                <div className="space-y-2 text-sm">
                  {wednesdayExtras.map(extra => {
                    // Show volunteers from this extras task
                    const allHelpers = extra.volunteers.length > 0 ? extra.volunteers : [];
                    
                    return (
                      <div key={extra.id} className="flex items-center gap-2 bg-white rounded px-3 py-2 border border-purple-200">
                        <span className="font-semibold text-purple-900">{extra.task}:</span>
                        {allHelpers.length > 0 ? (
                          allHelpers.map((helper, idx) => (
                            <span key={idx} className="text-purple-800">
                              {helper}
                              {extra.time && idx === 0 && <span className="text-purple-700 ml-1">({extra.time})</span>}
                              {idx < allHelpers.length - 1 && ', '}
                            </span>
                          ))
                        ) : (
                          <span className="text-purple-700 italic">No helpers assigned</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {wednesdayTasks.map((task: ThanksgivingTask) => {
                const isComplete = task.volunteers.length >= task.slotsNeeded;
                
                return (
                  <div 
                    key={task.id}
                    id={`task-${task.id}`}
                    className={`border rounded-lg p-3 transition-all ${
                      isComplete
                        ? 'border-green-300 bg-green-50'
                        : hoveredTask === task.id 
                          ? 'border-teal-400 bg-teal-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onMouseEnter={() => setHoveredTask(task.id)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {/* Task Title */}
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {task.time} - {task.task}
                        </p>
                        {isComplete && (
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded mt-1 inline-block">✓ Complete</span>
                        )}
                      </div>
                      <button
                        onClick={() => setAddSlotTaskId(task.id)}
                        className="px-2 py-1 text-xs font-medium text-white rounded transition-colors whitespace-nowrap"
                        style={{ 
                          backgroundColor: brand.color.teal,
                          minHeight: 'unset',
                          minWidth: 'unset',
                          transform: 'none',
                          boxShadow: 'none'
                        }}
                      >
                        + Add Slot
                      </button>
                    </div>
                    
                    {/* Task Rows - EXACT LITURGISTS PATTERN */}
                    <div className="space-y-2 text-sm">
                      {/* Lead Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium text-gray-700 whitespace-nowrap">Lead:</span>
                          {task.lead ? (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0 flex-1">
                              <span className="volunteer-name-print font-semibold text-green-900 truncate" title={task.lead}>
                                {task.lead}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedTask({ taskId: task.id, action: 'assign', isLead: true })}
                              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap"
                              style={{ 
                                minHeight: 'unset',
                                minWidth: 'unset',
                                transform: 'none',
                                boxShadow: 'none'
                              }}
                            >
                              Add Lead
                            </button>
                          )}
                        </div>
                        
                        {task.lead && (
                          <div className="shrink-0 sm:ml-2">
                            <button
                              onClick={() => handleRemoveVolunteer(task.id, task.lead!)}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors whitespace-nowrap w-full sm:w-auto"
                              style={{ 
                                minHeight: 'unset',
                                minWidth: 'unset',
                                transform: 'none',
                                boxShadow: 'none'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Volunteer Rows - Create individual row for each volunteer slot */}
                      {Array.from({ length: task.slotsNeeded }).map((_, idx) => {
                        const volunteer = task.volunteers[idx];
                        const volunteerNum = idx + 1;
                        
                        return (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="font-medium text-gray-700 whitespace-nowrap">Volunteer {volunteerNum}:</span>
                              {volunteer ? (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0 flex-1">
                                  <span className="volunteer-name-print font-semibold text-blue-900 truncate" title={volunteer}>
                                    {volunteer}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSelectedTask({ taskId: task.id, action: 'assign' })}
                                  className="px-3 py-1.5 text-xs font-medium text-white rounded-full transition-colors whitespace-nowrap"
                                  style={{ 
                                    backgroundColor: brand.color.teal,
                                    minHeight: 'unset',
                                    minWidth: 'unset',
                                    transform: 'none',
                                    boxShadow: 'none'
                                  }}
                                >
                                  Sign Up
                                </button>
                              )}
                            </div>
                            
                            {volunteer && (
                              <div className="shrink-0 sm:ml-2">
                                <button
                                  onClick={() => handleRemoveVolunteer(task.id, volunteer)}
                                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors whitespace-nowrap w-full sm:w-auto"
                                  style={{ 
                                    minHeight: 'unset',
                                    minWidth: 'unset',
                                    transform: 'none',
                                    boxShadow: 'none'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Thursday Tasks */}
        {(thursdayTasks.length > 0 || orderedBuffetTasks.length > 0) && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-3" style={{ margin: 0, marginBottom: '12px' }}>
              <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: brand.color.teal}}></span>
              Thursday, November 28 (Thanksgiving Day)
            </h3>

            {/* Buffet Service Master Card */}
            {orderedBuffetTasks.length > 0 && (
              <div className="border-2 rounded-lg p-4 mb-4 bg-gradient-to-br from-amber-50 to-orange-50 border-orange-300">
                <div className="mb-3">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center mb-1">
                    <svg className="w-5 h-5 mr-2" style={{ color: brand.color.teal }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Buffet Service (12:00 PM)
                  </h4>
                  
                  {/* Single Lead for Entire Buffet Service */}
                  <div className="mb-3 p-3 bg-white rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700 text-sm">Buffet Service Lead:</span>
                      <span className="volunteer-name-print font-bold text-green-900 text-sm">Clara Lehman</span>
                    </div>
                  </div>
                </div>

                {/* Individual Buffet Items */}
                <div className="space-y-3">
                  {orderedBuffetTasks.map((task: ThanksgivingTask) => {
                    const isComplete = task.volunteers.length >= task.slotsNeeded;
                    
                    return (
                      <div 
                        key={task.id}
                        id={`task-${task.id}`}
                        className={`border rounded-lg p-3 transition-all ${
                          isComplete
                            ? 'border-green-300 bg-green-50'
                            : 'border-orange-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        {/* Task Title */}
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">
                              {task.task}
                            </p>
                            {isComplete && (
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded mt-1 inline-block">✓ Complete</span>
                            )}
                          </div>
                          <button
                            onClick={() => setAddSlotTaskId(task.id)}
                            className="px-2 py-1 text-xs font-medium text-white rounded transition-colors whitespace-nowrap"
                            style={{ 
                              backgroundColor: brand.color.teal,
                              minHeight: 'unset',
                              minWidth: 'unset',
                              transform: 'none',
                              boxShadow: 'none'
                            }}
                          >
                            + Add Slot
                          </button>
                        </div>
                        
                        {/* Volunteer Rows Only (No Lead Row) */}
                        <div className="space-y-2 text-sm">
                          {Array.from({ length: task.slotsNeeded }).map((_, idx) => {
                            const volunteer = task.volunteers[idx];
                            const volunteerNum = idx + 1;
                            
                            return (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="font-medium text-gray-700 whitespace-nowrap">Volunteer {volunteerNum}:</span>
                                  {volunteer ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0 flex-1">
                                      <span className="font-semibold text-blue-900 truncate" title={volunteer}>
                                        {volunteer}
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setSelectedTask({ taskId: task.id, action: 'assign' })}
                                      className="px-3 py-1.5 text-xs font-medium text-white rounded-full transition-colors whitespace-nowrap"
                                      style={{ 
                                        backgroundColor: brand.color.teal,
                                        minHeight: 'unset',
                                        minWidth: 'unset',
                                        transform: 'none',
                                        boxShadow: 'none'
                                      }}
                                    >
                                      Sign Up
                                    </button>
                                  )}
                                </div>
                                
                                {volunteer && (
                                  <div className="shrink-0 sm:ml-2">
                                    <button
                                      onClick={() => handleRemoveVolunteer(task.id, volunteer)}
                                      className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors whitespace-nowrap w-full sm:w-auto"
                                      style={{ 
                                        minHeight: 'unset',
                                        minWidth: 'unset',
                                        transform: 'none',
                                        boxShadow: 'none'
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Extras/Misc Card for Thursday */}
            {thursdayExtras.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mb-3">
                <h4 className="font-semibold text-purple-900 flex items-center mb-2" style={{ fontSize: '0.95rem' }}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Misc / Extras
                </h4>
                <div className="space-y-2 text-sm">
                  {thursdayExtras.map(extra => {
                    // Show volunteers from this extras task
                    const allHelpers = extra.volunteers.length > 0 ? extra.volunteers : [];
                    
                    return (
                      <div key={extra.id} className="flex items-center gap-2 bg-white rounded px-3 py-2 border border-purple-200">
                        <span className="font-semibold text-purple-900">{extra.task}:</span>
                        {allHelpers.length > 0 ? (
                          allHelpers.map((helper, idx) => (
                            <span key={idx} className="text-purple-800">
                              {helper}
                              {extra.time && idx === 0 && <span className="text-purple-700 ml-1">({extra.time})</span>}
                              {idx < allHelpers.length - 1 && ', '}
                            </span>
                          ))
                        ) : (
                          <span className="text-purple-700 italic">No helpers assigned</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {thursdayTasks.map((task: ThanksgivingTask) => {
              const isComplete = task.volunteers.length >= task.slotsNeeded;
              
              return (
                <div 
                  key={task.id}
                  id={`task-${task.id}`}
                  className={`border rounded-lg p-3 transition-all ${
                    isComplete
                      ? 'border-green-300 bg-green-50'
                      : hoveredTask === task.id 
                        ? 'border-teal-400 bg-teal-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                >
                  {/* Date and Special Badges */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-800 text-sm">
                        {task.time} - {task.task}
                      </p>
                      {isComplete && (
                        <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-0.5 rounded">✓ COMPLETE</span>
                      )}
                    </div>
                    <button
                      onClick={() => setAddSlotTaskId(task.id)}
                      className="px-2 py-1 text-xs font-medium text-white rounded transition-colors whitespace-nowrap"
                      style={{ 
                        backgroundColor: brand.color.teal,
                        minHeight: 'unset',
                        minWidth: 'unset',
                        transform: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      + Add Slot
                    </button>
                  </div>
                  
                  {/* Task Rows - LITURGISTS PATTERN: Separate row for each position */}
                  <div className="text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Lead Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-medium text-gray-700 whitespace-nowrap">Lead:</span>
                        {task.lead ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0 flex-1">
                            <span className="volunteer-name-print font-semibold text-green-900 truncate" title={task.lead}>
                              {task.lead}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedTask({ taskId: task.id, action: 'assign', isLead: true })}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap"
                            style={{ 
                              minHeight: 'unset',
                              minWidth: 'unset',
                              transform: 'none',
                              boxShadow: 'none'
                            }}
                          >
                            Add Lead
                          </button>
                        )}
                      </div>
                      
                      {task.lead && (
                        <div className="shrink-0 sm:ml-2">
                          <button
                            onClick={() => handleRemoveVolunteer(task.id, task.lead!)}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors whitespace-nowrap w-full sm:w-auto"
                            style={{ 
                              minHeight: 'unset',
                              minWidth: 'unset',
                              transform: 'none',
                              boxShadow: 'none'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Volunteer Rows - Create individual row for each volunteer slot */}
                    {Array.from({ length: task.slotsNeeded }).map((_, idx) => {
                      const volunteer = task.volunteers[idx];
                      const volunteerNum = idx + 1;
                      
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-medium text-gray-700 whitespace-nowrap">Volunteer {volunteerNum}:</span>
                            {volunteer ? (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0 flex-1">
                                <span className="volunteer-name-print font-semibold text-blue-900 truncate" title={volunteer}>
                                  {volunteer}
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedTask({ taskId: task.id, action: 'assign' })}
                                className="px-3 py-1.5 text-xs font-medium text-white rounded-full transition-colors whitespace-nowrap"
                                style={{ 
                                  backgroundColor: brand.color.teal,
                                  minHeight: 'unset',
                                  minWidth: 'unset',
                                  transform: 'none',
                                  boxShadow: 'none'
                                }}
                              >
                                Sign Up
                              </button>
                            )}
                          </div>
                          
                          {volunteer && (
                            <div className="shrink-0 sm:ml-2">
                              <button
                                onClick={() => handleRemoveVolunteer(task.id, volunteer)}
                                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors whitespace-nowrap w-full sm:w-auto"
                                style={{ 
                                  minHeight: 'unset',
                                  minWidth: 'unset',
                                  transform: 'none',
                                  boxShadow: 'none'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Our Thanksgiving Celebration</h3>
          <div className="prose prose-sm max-w-none text-sm">
            <p className="text-gray-600 mb-4">
              The Ukiah Senior Center hosts a special Thanksgiving celebration over two days, bringing together our community for a festive meal. 
              This event requires many volunteers to help with preparation, serving, and cleanup.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>How to use this schedule:</strong> Click on any &ldquo;Sign Up&rdquo; button to volunteer for a task. 
              Tasks are organized by day and time. You can cancel your signup by clicking the &ldquo;Cancel&rdquo; button next to your name.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Complete - all volunteer slots filled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>In progress - volunteers still needed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-8 text-sm">
          <p className="mb-1">
            <strong>Ukiah Senior Center</strong>
          </p>
          <p className="mb-1">
            499 Leslie Street, Ukiah, CA 95482 | 707.462.4343
          </p>
          <p className="text-xs">
            <a 
              href="https://ukiahseniorcenter.org" 
              className="hover:underline"
              style={{ color: brand.color.teal }}
              target="_blank"
              rel="noopener noreferrer"
            >
              ukiahseniorcenter.org
            </a>
          </p>
        </footer>
      </div>

      {/* Jump Menu Modal */}
      {showJumpMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center sm:justify-center"
          onClick={() => setShowJumpMenu(false)}
        >
          <div 
            className="bg-white rounded-t-xl sm:rounded-xl w-full sm:max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2" style={{ color: brand.color.teal }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Jump
              </h3>
              <button
                onClick={() => setShowJumpMenu(false)}
                className="text-gray-400 hover:text-gray-600"
                style={{ 
                  minHeight: 'unset',
                  minWidth: 'unset',
                  transform: 'none',
                  boxShadow: 'none'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Wednesday Section */}
              {wednesdayTasks.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: brand.color.teal}}></span>
                    Wednesday, November 27
                  </h4>
                  <div className="space-y-1">
                    {wednesdayTasks.map(task => {
                      const filled = task.volunteers.length + (task.lead ? 1 : 0);
                      const total = task.slotsNeeded + (task.lead ? 1 : 0);
                      const isComplete = filled >= total;
                      
                      return (
                        <button
                          key={task.id}
                          onClick={() => {
                            setShowJumpMenu(false);
                            setTimeout(() => {
                              document.getElementById(`task-${task.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                          style={{ 
                            minHeight: 'unset',
                            minWidth: 'unset',
                            transform: 'none',
                            boxShadow: 'none'
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{task.time} - {task.task}</p>
                            <p className="text-xs text-gray-500">{task.section}</p>
                          </div>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                            isComplete ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {filled}/{total}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Thursday Section */}
              {thursdayTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: brand.color.teal}}></span>
                    Thursday, November 28
                  </h4>
                  <div className="space-y-1">
                    {thursdayTasks.map(task => {
                      const filled = task.volunteers.length + (task.lead ? 1 : 0);
                      const total = task.slotsNeeded + (task.lead ? 1 : 0);
                      const isComplete = filled >= total;
                      
                      return (
                        <button
                          key={task.id}
                          onClick={() => {
                            setShowJumpMenu(false);
                            setTimeout(() => {
                              document.getElementById(`task-${task.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                          style={{ 
                            minHeight: 'unset',
                            minWidth: 'unset',
                            transform: 'none',
                            boxShadow: 'none'
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{task.time} - {task.task}</p>
                            <p className="text-xs text-gray-500">{task.section}</p>
                          </div>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                            isComplete ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {filled}/{total}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No Results */}
              {wednesdayTasks.length === 0 && thursdayTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No tasks match current filters</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterUnfilledOnly(false);
                      setShowJumpMenu(false);
                    }}
                    className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
                    style={{ 
                      minHeight: 'unset',
                      minWidth: 'unset',
                      transform: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
