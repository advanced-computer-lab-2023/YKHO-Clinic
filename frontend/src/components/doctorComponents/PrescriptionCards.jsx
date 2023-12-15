import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { IconButton } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
export default function PrescriptionCards(props) {
    return (
<Card sx={{width:"450px",height:"130px"}}>
    <CardContent>
    <div style={{display:"flex",alignItems:"center"}}>
    <SummarizeIcon sx={{fontSize:80}}/>
    <div style={{marginLeft:8}}>
        <Typography sx={{width:250}} noWrap ><b>name</b>: {props.prescriptionName}</Typography>
        <Typography ><b>status</b>:{props.filled ? "filled" : "not filled"}</Typography>
    </div>
    <div style={{display:"flex", marginTop:-60,marginLeft:"auto"}}>

    {!props.filled&&<IconButton onClick={()=>{props.retrieveNames(props.MedicineNames,props._id)}}>
        <EditNoteIcon/>
    </IconButton>}
    </div>
    </div>
    </CardContent>
</Card>
    );
}