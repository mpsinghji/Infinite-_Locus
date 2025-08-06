import React, { useEffect, useState } from 'react';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [message, setMessage] = useState('');
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
    }
  }, [myId, token]);

  const handleDelete = async (id) => {
    setMessage('');
    try {
      const res = await fetch(`http://localhost:3000/event/${id}`, {
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
        setMessage('Event updated!');
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
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch {
      setMessage('Registration error');
    }
  };

  const otherEvents = events.filter(ev => ev.createdBy !== myId);

  return (
    <div className='event-list grid grid-cols-1 md:grid-cols-2 gap-8'>
      {message && <div className="text-red-600 mb-2 col-span-2">{message}</div>}
      <div>
        <h2 className="text-lg font-bold mb-2">My Events</h2>
        {myEvents.map((event) => (
          <div key={event._id} className='event-item border p-4 mb-4 rounded shadow'>
            {editEventId === event._id ? (
              <form onSubmit={handleEditSubmit}>
                <input name="title" value={editForm.title} onChange={handleEditChange} className="block w-full mb-1 p-1 border rounded" />
                <textarea name="description" value={editForm.description} onChange={handleEditChange} className="block w-full mb-1 p-1 border rounded" />
                <input name="date" type="date" value={editForm.date} onChange={handleEditChange} className="block w-full mb-1 p-1 border rounded" />
                <input name="location" value={editForm.location} onChange={handleEditChange} className="block w-full mb-1 p-1 border rounded" />
                <input name="startTime" type="time" value={editForm.startTime} onChange={handleEditChange} className="block w-full mb-1 p-1 border rounded" />
                <input name="endTime" type="time" value={editForm.endTime} onChange={handleEditChange} className="block w-full mb-1 p-1 border rounded" />
                <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded mr-2">Save</button>
                <button type="button" className="bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditEventId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p>{event.description}</p>
                <p>Date: {event.date}</p>
                <p>Location: {event.location}</p>
                <p>Registrations: {event.registrationsCount || 0}</p>
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
                <button className='event-button bg-yellow-500 text-white px-2 py-1 rounded mr-2' onClick={() => handleEdit(event)}>Edit</button>
                <button className='event-button bg-red-600 text-white px-2 py-1 rounded' onClick={() => handleDelete(event._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Other Events</h2>
        {otherEvents.map((event) => (
          <div key={event._id} className='event-item border p-4 mb-4 rounded shadow'>
            <h2 className="text-xl font-bold">{event.title}</h2>
            <p>{event.description}</p>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>Registrations: {event.registrationsCount || 0}</p>
            <button className='event-button bg-blue-600 text-white px-2 py-1 rounded' onClick={() => handleRegister(event._id)}>Register</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;