import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  FormControl,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { jsPDF } from "jspdf";
import background from "./assets/alojamientos_temporales_punta_azul.png";
import CropImage from "./componentes/crop/cropimage";
import page2Background from "./assets/avisos_punta_azul.jpg";

function MudanzasForm() {
  const [formData, setFormData] = useState({
    departamento: "",
    propietario: "",
    contactoResponsable: "",
    plataforma: "",
    fechaLlegada: "",
    horaLlegada: "",
    fechaSalida: "",
    horaSalida: "",
    nombreReservacion: "",
    telefonoContacto: "",
    telefonoEmergencia: "",
    tipoIdentificacion: "",
    automovil: "",
    numeroPersonas: "",
    pulserasAsignadas: "",
    nombres: Array(15).fill(""),
    mascotasServicio: false,
    observaciones: "",
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para el Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensaje del Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severidad del Snackbar

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 595;
      canvas.height = 842;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 595, 842);
      setBackgroundImage(canvas.toDataURL("image/jpeg"));
    };
    img.src = background;
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name.startsWith("nombres")) {
      const index = parseInt(name.replace("nombres[", "").replace("]", ""));
      const nombres = [...formData.nombres];
      nombres[index] = value;
      setFormData({ ...formData, nombres });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setCroppedImages((prevImages) => [...prevImages, croppedImage]);
    setImageSrc(null);
    setSnackbarMessage("Imagen agregada correctamente."); // Mensaje de éxito
    setSnackbarSeverity("success");
    setSnackbarOpen(true); // Abre el Snackbar
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false); // Cierra el Snackbar
  };

  const generatePDF = () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

    if (backgroundImage) {
      pdf.addImage(backgroundImage, "JPEG", 0, 0, 446, 631);
    }
    pdf.setFontSize(10);
    pdf.text(formData.departamento, 220, 113);
    pdf.text(formData.propietario, 220, 130);
    pdf.text(formData.contactoResponsable, 220, 146);
    pdf.text(formData.plataforma, 220, 163);
    pdf.text(formData.fechaLlegada, 110, 205);
    pdf.text(formData.horaLlegada, 280, 205);
    pdf.text(formData.fechaSalida, 110, 230);
    pdf.text(formData.horaSalida, 280, 230);
    pdf.text(formData.nombreReservacion, 220, 262);
    pdf.text(formData.telefonoContacto, 220, 273);
    pdf.text(formData.telefonoEmergencia, 220, 284);
    pdf.text(formData.tipoIdentificacion, 220, 295);
    pdf.text(formData.automovil, 220, 306);
    pdf.text(formData.numeroPersonas, 220, 317);
    pdf.text(formData.pulserasAsignadas, 220, 330);
    pdf.text(formData.observaciones, 220, 548);

    formData.nombres.forEach((nombre, index) => {
      pdf.text(nombre, 220, 341 + index * 11.8);
    });

    pdf.text(
      formData.mascotasServicio
        ? "Excepción autorizada (con comprobante médico)"
        : "No aplica",
      220,
      525
    );

    croppedImages.forEach((img) => {
      pdf.addPage();
      pdf.addImage(page2Background, "JPEG", 0, 0, 446, 631);
      pdf.addImage(img, "PNG", 50, 150, 295, 202);
    });

    pdf.save(`Autorizacion_${formData.nombreCompleto}.pdf`);

    //Limpiar los campos
    setFormData({
      departamento: "",
      propietario: "",
      contactoResponsable: "",
      plataforma: "",
      fechaLlegada: "",
      horaLlegada: "",
      fechaSalida: "",
      horaSalida: "",
      nombreReservacion: "",
      telefonoContacto: "",
      telefonoEmergencia: "",
      tipoIdentificacion: "",
      automovil: "",
      numeroPersonas: "",
      pulserasAsignadas: "",
      nombres: Array(15).fill(""),
      mascotasServicio: false,
      observaciones: "",
    });


    setCroppedImages([]); // Limpiar las imágenes cargadas
  };

  return (
    <Container>
      <form>
        <FormControl fullWidth margin="normal">
          <TextField label="Departamento" name="departamento" value={formData.departamento} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Propietario" name="propietario" value={formData.propietario} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Contacto Responsable" name="contactoResponsable" value={formData.contactoResponsable} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Plataforma" name="plataforma" value={formData.plataforma} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Fecha de Llegada" name="fechaLlegada" value={formData.fechaLlegada} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Hora de Llegada" name="horaLlegada" value={formData.horaLlegada} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Fecha de Salida" name="fechaSalida" value={formData.fechaSalida} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Hora de Salida" name="horaSalida" value={formData.horaSalida} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Nombre de quien realizó la reservación" name="nombreReservacion" value={formData.nombreReservacion} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Teléfono de contacto" name="telefonoContacto" value={formData.telefonoContacto} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Teléfono de emergencia" name="telefonoEmergencia" value={formData.telefonoEmergencia} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Tipo de identificación" name="tipoIdentificacion" value={formData.tipoIdentificacion} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Automóvil (color, modelo, placas)" name="automovil" value={formData.automovil} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Número de personas ingresadas" name="numeroPersonas" value={formData.numeroPersonas} onChange={handleChange} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Pulseras asignadas y color" name="pulserasAsignadas" value={formData.pulserasAsignadas} onChange={handleChange} />
        </FormControl>
        {formData.nombres.map((nombre, index) => (
          <FormControl fullWidth margin="normal" key={`nombres[${index}]`}>
            <TextField label={`Nombre ${index + 1}`} name={`nombres[${index}]`} value={nombre} onChange={handleChange} />
          </FormControl>
        ))}
        <FormControlLabel
          control={<Checkbox checked={formData.mascotasServicio} onChange={handleChange} name="mascotasServicio" />}
          label="Excepción autorizada por mascotas de servicio o apoyo emocional (comprobante médico)"
        />
        <FormControl fullWidth margin="normal">
          <TextField label="Observaciones" name="observaciones" value={formData.observaciones} onChange={handleChange} />
        </FormControl>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageSrc && (
          <CropImage imageSrc={imageSrc} onCropCompleteCallback={handleCropComplete} onClose={() => setImageSrc(null)} />
        )}
        <Button variant="contained" style={{ marginTop: "20px" }} onClick={generatePDF}>
          Generar PDF
        </Button>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </form>
    </Container>
  );
}

export default MudanzasForm;