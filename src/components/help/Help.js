import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Email as EmailIcon,
} from "@mui/icons-material"
import Layout from "../common/Layout"

const Help = () => {
  return (
    <Layout title="Help">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Help & Documentation
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Welcome to the Campus Help Desk System
          </Typography>
          <Typography variant="body1" paragraph>
            This help section provides information on how to use the Campus Help Desk system effectively. The system is
            designed to streamline the process of submitting and managing service requests for various campus
            facilities.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/Final-Start.gif"
                alt="Getting Started"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Getting Started
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn the basics of the Campus Help Desk system and how to navigate through different sections.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/Final-Request.gif"
                alt="Creating Requests"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Creating Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Step-by-step guide on how to create and submit service requests for campus facilities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/Final-Managing.gif"
                alt="Managing Requests"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Managing Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn how to track, update, and close service requests in the system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Frequently Asked Questions
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>How do I create a new service request?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>To create a new service request:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="1. Click on the 'New Request' button in the dashboard or navigate to Requests > New Request." />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Fill in the request details including title, description, facility, and severity." />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Click 'Submit Request' to create the request." />
              </ListItem>
            </List>
            <Typography>
              Once submitted, the request will be visible in your 'My Requests' list and will be sent to the appropriate
              facility head for assignment.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
            <Typography>How can I check the status of my requests?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>You can check the status of your requests in several ways:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="1. The dashboard shows a summary of your recent requests and their statuses." />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Navigate to 'My Requests' to see a complete list of all your requests." />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Click on any request to view its detailed status, including comments." />
              </ListItem>
            </List>
            <Typography>Request statuses include: Unassigned, Assigned, In Progress, Closed, and Rejected.</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
            <Typography>How do I delete a request?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>To close a request that you created:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="1. Navigate to 'My Requests' and find the request you want to close." />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Click on the request to view its details." />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Click the 'Delete Request' button at the top right." />
              </ListItem>
            </List>
            <Typography>
              Note: Depending on system settings, you may only be able to close requests that you created before it is assigned to any facility worker.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4a-content" id="panel4a-header">
            <Typography>How do I change my password?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>To change your password:</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="1. Click on your profile icon in the top right corner of the screen." />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Select 'Change Password' from the dropdown menu." />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Enter your current password and your new password twice." />
              </ListItem>
              <ListItem>
                <ListItemText primary="4. Click 'Change Password' to save your changes." />
              </ListItem>
            </List>
            <Typography>
              For security reasons, passwords should be at least 6 characters long and include a mix of letters,
              numbers, and special characters.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5a-content" id="panel5a-header">
            <Typography>What do the different severity levels mean?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>The system uses four severity levels to prioritize requests:</Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Low"
                  secondary="Minor issues that don't significantly impact operations. Example: A broken chair or a flickering light."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Medium"
                  secondary="Issues that cause inconvenience but don't prevent core functions. Example: AC not cooling properly or a projector with poor image quality."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="High"
                  secondary="Significant issues that impact operations. Example: A non-functioning projector before a presentation or water leakage."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Critical"
                  secondary="Urgent issues that require immediate attention. Example: Power outage, major water leak, or safety hazards."
                />
              </ListItem>
            </List>
            <Typography>
              Choose the appropriate severity level to ensure your request gets the right priority.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            System Modules
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
            <ListItem>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText
                primary="Requests Module"
                secondary="Create, view, and manage service requests for campus facilities."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText
                primary="Facilities Module"
                secondary="View and manage different facilities available on campus."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Assignees Module"
                secondary="Manage personnel responsible for handling service requests."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Administrator Module"
                secondary="System administration functions including user management and settings."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText
                primary="Reports Module"
                secondary="Generate and view reports on service requests and system usage."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email Alerts"
                secondary="Automatic email notifications for request updates and status changes."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Need More Help?
          </Typography>
          <Typography variant="body1" paragraph>
            If you need additional assistance, please contact the system administrator at admin@example.com.
          </Typography>
        </Box>
      </Paper>
    </Layout>
  )
}

export default Help
