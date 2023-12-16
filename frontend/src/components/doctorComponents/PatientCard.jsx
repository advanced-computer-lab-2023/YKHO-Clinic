import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

function PatientCard({patient,showPatientInfo}){
    return (
        <Card sx={{width:300,height:150}}>
            <CardContent sx={{display:"flex",alignItems:"center"}}>
                <AssignmentIndIcon style={{fontSize:"60"}} />
                <div>
                    <Typography>name:{patient.name}</Typography>
                    <Typography>phone:{patient.mobileNumber}</Typography>
                </div>
            </CardContent>
            <CardActions>
                <Button variant="text" color="primary" onClick={()=>{
                    showPatientInfo(patient._id);
                }}>view more info</Button>
            </CardActions>
        </Card>
    )
}
export default PatientCard;