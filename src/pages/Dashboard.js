import React, { useEffect } from "react";
import { CircularProgress, Grid  } from "@mui/material";

import SideBar from "../components/Dashboard/SideBar";
import DashboardAnnouncements from "../components/Dashboard/DashboardAnnouncements";
import DashboardEvents from "../components/Dashboard/DashboardEvents";

import { fetchAnnouncements } from "../api/AnnouncementsAPI";
import { fetchMyClubs } from "../api/ClubsAPI";
import { fetchUserUpcomingEvents } from "../api/EventsAPI";
import { useSelector } from "react-redux";

import { transformAnnouncements, transformEvents } from "guest_content";

const Dashboard = () => {
  const guest = useSelector((state) => state.guest);
  const [loading, setLoading] = React.useState(true);

  const user = useSelector((state) => state.user.uid);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const [userClubs, setUserClubs] = React.useState([]);

  const [announcements, setAnnouncements] = React.useState([]);
  const [events, setEvents] = React.useState([]);

  const [selectedClubAnnouncements, setSelectedClubAnnouncements] = React.useState([])
  const [selectedClubEvents, setSelectedClubEvents] = React.useState([])

  useEffect(() => {
    if (loggedIn) {
      fetchAnnouncements(user).then((announcements) => {setAnnouncements(announcements)});
      fetchMyClubs(user)
      .then((clubs) => {
        const userClubs = clubs.map((club) => club.name);
        setUserClubs(userClubs);
      });
      fetchUserUpcomingEvents(user)
      .then((upcomingEvents) => {
        setEvents(upcomingEvents);
        setLoading(false);
      });
    } else if (guest.guestMode) {
        setAnnouncements(transformAnnouncements(guest.announcements))
        setEvents(transformEvents(guest.upcomingEvents))

        const userClubs = guest.clubs.map((club) => club.name);
        setUserClubs(userClubs);
        setLoading(false);
    }
  }, [user, guest.clubMemberships]);

  const filteredAnnouncements = announcements.filter((announcement) => announcement.name.includes(selectedClubAnnouncements))
  const filteredEvents = events.filter((event) => event.name.includes(selectedClubEvents))

  function isAdmin(announcement) {
    return (((announcement.role === "owner" || announcement.role === "admin") && announcement.visibility === "private") || announcement.visibility === "public")
  }

  const combineAllGuestAnnouncements = (announcements) => {
    if(Object.keys(guest.announcements).length > 0){
      const combinedAnnouncements = announcements.concat(guest.announcements);
      const sortedAnnouncements = combinedAnnouncements.sort((a, b) => {
          return new Date(b.time_posted) - new Date(a.time_posted);
      });
      setAnnouncements(sortedAnnouncements);
    }
  }

  if (loading === true) {
    return (
      <div align="center">
        <CircularProgress />
      </div>
    )
  }

  return (
    <Grid container>
      <SideBar
        userClubs={userClubs}
        selectedClubAnnouncements={selectedClubAnnouncements}
        selectedClubEvents={selectedClubEvents}
        setSelectedClubAnnouncements={setSelectedClubAnnouncements}
        setSelectedClubEvents={setSelectedClubEvents}
      />
      <Grid item xs={8}>
        {selectedClubEvents === false ? 
          <DashboardAnnouncements 
            admin={isAdmin(announcements)}
            clubs={userClubs}
            announcements={announcements}
            filteredAnnouncements={filteredAnnouncements}
            selectedClubAnnouncements={selectedClubAnnouncements}
          /> : 
          <DashboardEvents
            user={user}
            clubs={userClubs}
            events={events}
            filteredEvents={filteredEvents}
            fetchUserUpcomingEvents={fetchUserUpcomingEvents}
            selectedClubEvents={selectedClubEvents}
          />
        }
      </Grid>
    </Grid>
  );
};

export default Dashboard;