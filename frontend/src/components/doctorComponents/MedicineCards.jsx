import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MedicationIcon from '@mui/icons-material/Medication';
import { IconButton } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ClearIcon from '@mui/icons-material/Clear';
export default function MedicineNames(props) {
    return (
        <Card sx={{width:"450px",height:"130px"}}>
    <CardContent>
    <div style={{display:"flex",alignItems:"center"}}>
    <MedicationIcon sx={{fontSize:80}}/>
    <div style={{marginLeft:8}}>
        <Typography sx={{width:250}} noWrap ><b>name</b>: {props.name}</Typography>
        <Typography noWrap><b>dosage</b>:{props.dosage}</Typography>
    </div>
    <div style={{display:"flex", marginTop:-60,marginLeft:"auto"}}>

    <IconButton onClick={()=>{props.updateMedicine(props.name)}}>
        <EditNoteIcon/>
    </IconButton>
    <IconButton onClick={()=>{props.deleteMedicine(props.price,props.name)}}>
        <ClearIcon/>
    </IconButton>
    </div>
    </div>
    </CardContent>
</Card>
    );
}