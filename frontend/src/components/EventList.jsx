import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState('');
  const token = localStorage.getItem('token');
  const [myId, setMyId] = useState(null);
  const [editEventId, setEditEventId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', location: '', startTime: '', endTime: '' });

  useEffect(() => {
    fetch('http://localhost:3000/event', {
      headers: { token },
    })
      .then(response => response.json())
      .then(data => {
        setEvents(data);
      })
      .catch(() => {
        setMessage('Error fetching events');
      });
  }, [token]);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:3000/user/me', { headers: { token } })
        .then(res => res.json())
        .then(data => {
          if (data && data.user && data.user._id) setMyId(data.user._id);
        });
    }
  }, [token]);

  useEffect(() => {
    if (myId) {
      fetch('http://localhost:3000/event/my', { headers: { token } })
        .then(res => res.json())
        .then(data => setMyEvents(data));
      // Fetch registrations for this user
      fetch('http://localhost:3000/event/my-registrations', { headers: { token } })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRegisteredEventIds(data.map(reg => reg.event?._id).filter(Boolean));
          } else if (Array.isArray(data.registrations)) {
            setRegisteredEventIds(data.registrations.map(reg => reg.event?._id).filter(Boolean));
          }
        });
    }
  }, [myId, token]);

  const handleDelete = async (id) => {
    setMessage('');
    try {
      const userId = myId;
      const res = await fetch(`http://localhost:3000/event/${id}?userId=${userId}`, {
        method: 'DELETE',
        headers: { token },
      });
      if (res.ok) {
        setEvents(events.filter(event => event._id !== id));
        setMyEvents(myEvents.filter(event => event._id !== id));
      } else {
        setMessage('Error deleting event');
      }
    } catch {
      setMessage('Error deleting event');
    }
  };

  const handleEdit = (event) => {
    setEditEventId(event._id);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`http://localhost:3000/event/${editEventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents(events.map(ev => ev._id === editEventId ? { ...ev, ...editForm } : ev));
        setMyEvents(myEvents.map(ev => ev._id === editEventId ? { ...ev, ...editForm } : ev));
        setEditEventId(null);
        setToast('Event updated successfully!');
        setTimeout(() => setToast(''), 2500);
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch {
      setMessage('Update error');
    }
  };

  const handleRegister = async (eventId) => {
    setMessage('');
    try {
      const res = await fetch('http://localhost:3000/event/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setMessage('Registered successfully!');
        setEvents(events.map(ev => ev._id === eventId ? { ...ev, registrationsCount: (ev.registrationsCount || 0) + 1 } : ev));
        setRegisteredEventIds([...registeredEventIds, eventId]);
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch {
      setMessage('Registration error');
    }
  };

  const otherEvents = events.filter(ev => ev.createdBy !== myId);

  return (
    <div className="event-list px-2 md:px-8 py-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
      {message && <div className="text-red-600 mb-2 col-span-2 text-center">{message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">My Events</h2>
          {myEvents.map((event) => (
            <div key={event._id} className="event-item bg-white border border-blue-100 p-6 mb-6 rounded-2xl shadow-lg transition hover:shadow-2xl">
              {editEventId === event._id ? (
                <form onSubmit={handleEditSubmit}>
                  <input name="title" value={editForm.title} onChange={handleEditChange} className="block w-full mb-2 p-2 border rounded-lg" />
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} className="block w-full mb-2 p-2 border rounded-lg" />
                  <input name="date" type="date" value={editForm.date} onChange={handleEditChange} className="block w-full mb-2 p-2 border rounded-lg" />
                  <input name="location" value={editForm.location} onChange={handleEditChange} className="block w-full mb-2 p-2 border rounded-lg" />
                  <input name="startTime" type="time" value={editForm.startTime} onChange={handleEditChange} className="block w-full mb-2 p-2 border rounded-lg" />
                  <input name="endTime" type="time" value={editForm.endTime} onChange={handleEditChange} className="block w-full mb-2 p-2 border rounded-lg" />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"><FaCheckCircle />Save</button>
                    <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold" onClick={() => setEditEventId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2 text-blue-800">{event.title}</h2>
                  <p className="mb-1 text-gray-700">{event.description}</p>
                  <p className="mb-1 text-gray-600">Date: {event.date}</p>
                  <p className="mb-1 text-gray-600">Location: {event.location}</p>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">Registrations: {event.registrationsCount || 0}</span>
                  {event.registrations && event.registrations.length > 0 && (
                    <div className="mt-2">
                      <h3 className="font-semibold">Registered Users:</h3>
                      <ul className="list-disc ml-5">
                        {event.registrations.map((reg) => (
                          <li key={reg._id}>{reg.user?.name} ({reg.user?.email})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500 transition" onClick={() => handleEdit(event)}><FaEdit />Edit</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-600 transition" onClick={() => handleDelete(event._id)}><FaTrash />Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Other Events</h2>
          {otherEvents.map((event) => {
            const isRegistered = registeredEventIds.includes(event._id);
            return (
              <div key={event._id} className="event-item bg-white border border-blue-100 p-6 mb-6 rounded-2xl shadow-lg transition hover:shadow-2xl">
                <h2 className="text-xl font-bold mb-2 text-blue-800">{event.title}</h2>
                <p className="mb-1 text-gray-700">{event.description}</p>
                <p className="mb-1 text-gray-600">Date: {event.date}</p>
                <p className="mb-1 text-gray-600">Location: {event.location}</p>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">Registrations: {event.registrationsCount || 0}</span>
                <button
                  className={`event-button px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${isRegistered ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition'}`}
                  onClick={() => !isRegistered && handleRegister(event._id)}
                  disabled={isRegistered}
                >
                  {isRegistered ? <><FaCheckCircle /> Registered</> : 'Register'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventList;