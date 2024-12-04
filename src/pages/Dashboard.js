import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Typography,
    Box,
    Alert,
    Snackbar,
    MenuItem,
    FormControlLabel,
    Switch,
    Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Upload as UploadIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { getLenses, createLens, updateLens, deleteLens } from '../services/api';
import Papa from 'papaparse';

function Dashboard() {
    const [lenses, setLenses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLens, setSelectedLens] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        // Basic Info
        brand: '',
        name: '',
        manufacturer: '',
        material: '',
        modality: '',
        dkt: '',
        diameter: '',
        baseCurve: '',
        centreThickness: '',
        blueLight: false,
        type: 'Spherical',

        // Prescription Parameters
        spherePowers: [{
            min: '',
            max: '',
            steps: ''
        }],
        cylinderPowers: [{
            type: 'fixed',
            power: '',
            min: '',
            max: '',
            steps: '',
            axisRanges: [{
                from: '',
                to: '',
                step: ''
            }]
        }],
        addPowers: [{
            type: 'fixed',
            value: '',
            label: ''
        }]
    });

    const modalityOptions = ['Daily', 'Bi-Weekly', 'Monthly'];
    const typeOptions = ['Spherical', 'Toric', 'Multifocal', 'MultifocalToric'];

    useEffect(() => {
        fetchLenses();
    }, []);

    const fetchLenses = async () => {
        try {
            const data = await getLenses();
            setLenses(data);
        } catch (error) {
            showSnackbar('Error fetching lenses', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // Helper functions for managing arrays of powers
    const addSphereRange = () => {
        setFormData({
            ...formData,
            spherePowers: [...formData.spherePowers, { min: '', max: '', steps: '' }]
        });
    };

    const removeSphereRange = (index) => {
        const newSphereRanges = formData.spherePowers.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            spherePowers: newSphereRanges
        });
    };

    const updateSphereRange = (index, field, value) => {
        const newSphereRanges = [...formData.spherePowers];
        newSphereRanges[index] = {
            ...newSphereRanges[index],
            [field]: value
        };
        setFormData({
            ...formData,
            spherePowers: newSphereRanges
        });
    };

    const addCylinderPower = () => {
        setFormData({
            ...formData,
            cylinderPowers: [...formData.cylinderPowers, {
                type: 'fixed',
                power: '',
                min: '',
                max: '',
                steps: '',
                axisRanges: [{
                    from: '',
                    to: '',
                    step: ''
                }]
            }]
        });
    };

    const removeCylinderPower = (index) => {
        const newCylinderPowers = formData.cylinderPowers.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            cylinderPowers: newCylinderPowers
        });
    };

    const updateCylinderPower = (index, field, value) => {
        const newCylinderPowers = [...formData.cylinderPowers];
        newCylinderPowers[index] = {
            ...newCylinderPowers[index],
            [field]: value
        };
        setFormData({
            ...formData,
            cylinderPowers: newCylinderPowers
        });
    };

    const addAxisRange = (cylinderIndex) => {
        const newCylinderPowers = [...formData.cylinderPowers];
        newCylinderPowers[cylinderIndex].axisRanges.push({
            from: '',
            to: '',
            step: ''
        });
        setFormData({
            ...formData,
            cylinderPowers: newCylinderPowers
        });
    };

    const updateAxisRange = (cylinderIndex, axisIndex, field, value) => {
        const newCylinderPowers = [...formData.cylinderPowers];
        newCylinderPowers[cylinderIndex].axisRanges[axisIndex][field] = value;
        setFormData({
            ...formData,
            cylinderPowers: newCylinderPowers
        });
    };

    const addAddPower = () => {
        setFormData({
            ...formData,
            addPowers: [...formData.addPowers, {
                type: 'fixed',
                value: '',
                label: ''
            }]
        });
    };

    const removeAddPower = (index) => {
        const newAddPowers = formData.addPowers.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            addPowers: newAddPowers
        });
    };

    const updateAddPower = (index, field, value) => {
        const newAddPowers = [...formData.addPowers];
        newAddPowers[index] = {
            ...newAddPowers[index],
            [field]: value
        };
        setFormData({
            ...formData,
            addPowers: newAddPowers
        });
    };

    const handleOpenDialog = (lens = null) => {
        if (lens) {
            setSelectedLens(lens);
            setFormData({
                // Basic Info
                brand: lens.brand || '',
                name: lens.name || '',
                manufacturer: lens.manufacturer || '',
                material: lens.material || '',
                modality: lens.modality || '',
                dkt: lens.dkt || '',
                diameter: lens.diameter && lens.diameter[0] ? lens.diameter[0] : '',
                baseCurve: lens.baseCurve && lens.baseCurve[0] ? lens.baseCurve[0] : '',
                centreThickness: lens.centreThickness || '',
                blueLight: lens.blueLight || false,
                type: lens.type || 'Spherical',

                // Prescription Parameters
                spherePowers: lens.spherePowers || [{
                    min: '',
                    max: '',
                    steps: ''
                }],
                cylinderPowers: lens.cylinderPowers || [{
                    type: 'fixed',
                    power: '',
                    min: '',
                    max: '',
                    steps: '',
                    axisRanges: [{
                        from: '',
                        to: '',
                        step: ''
                    }]
                }],
                addPowers: lens.addPowers || [{
                    type: 'fixed',
                    value: '',
                    label: ''
                }]
            });
        } else {
            setSelectedLens(null);
            setFormData({
                // Reset to initial state
                brand: '',
                name: '',
                manufacturer: '',
                material: '',
                modality: '',
                dkt: '',
                diameter: '',
                baseCurve: '',
                centreThickness: '',
                blueLight: false,
                type: 'Spherical',
                spherePowers: [{
                    min: '',
                    max: '',
                    steps: ''
                }],
                cylinderPowers: [{
                    type: 'fixed',
                    power: '',
                    axisRanges: [{
                        from: '',
                        to: '',
                        step: ''
                    }]
                }],
                addPowers: [{
                    type: 'fixed',
                    value: '',
                    label: ''
                }]
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedLens(null);
    };

    const handleSubmit = async () => {
        try {
            const lensData = {
                // Basic Info
                brand: formData.brand,
                name: formData.name,
                manufacturer: formData.manufacturer,
                material: formData.material,
                modality: formData.modality,
                dkt: parseFloat(formData.dkt),
                diameter: [parseFloat(formData.diameter)],
                baseCurve: [parseFloat(formData.baseCurve)],
                centreThickness: parseFloat(formData.centreThickness),
                blueLight: formData.blueLight,
                type: formData.type,

                // Prescription Parameters
                spherePowers: formData.spherePowers.map(range => ({
                    min: parseFloat(range.min),
                    max: parseFloat(range.max),
                    steps: parseFloat(range.steps)
                })),
                cylinderPowers: formData.cylinderPowers.map(cyl => ({
                    type: cyl.type,
                    ...(cyl.type === 'fixed' ? {
                        power: parseFloat(cyl.power)
                    } : {
                        min: parseFloat(cyl.min),
                        max: parseFloat(cyl.max),
                        steps: parseFloat(cyl.steps)
                    }),
                    axisRanges: cyl.axisRanges.map(axis => ({
                        from: parseInt(axis.from),
                        to: parseInt(axis.to),
                        step: parseInt(axis.step)
                    }))
                })),
                addPowers: formData.addPowers.map(add => ({
                    type: add.type,
                    value: parseFloat(add.value),
                    label: add.label
                }))
            };

            if (selectedLens) {
                await updateLens(selectedLens._id, lensData);
                showSnackbar('Lens updated successfully');
            } else {
                await createLens(lensData);
                showSnackbar('Lens added successfully');
            }
            handleCloseDialog();
            fetchLenses();
        } catch (error) {
            console.error('Error saving lens:', error);
            showSnackbar('Error saving lens: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lens?')) {
            try {
                await deleteLens(id);
                showSnackbar('Lens deleted successfully');
                fetchLenses();
            } catch (error) {
                showSnackbar('Error deleting lens: ' + (error.response?.data?.message || error.message), 'error');
            }
        }
    };

    // CSV handling functions
    const downloadTemplate = () => {
        const templateData = [{
            brand: "Example Brand",
            name: "Example Name",
            manufacturer: "Example Manufacturer",
            material: "Example Material",
            dkt: "100",
            modality: "Daily",
            diameter: "14.2",
            baseCurve: "8.6",
            centreThickness: "0.08",
            type: "Spherical",
            blueLight: "false",
            spherePowers: JSON.stringify([{
                min: "-6.00",
                max: "6.00",
                steps: "0.25"
            }]),
            cylinderPowers: JSON.stringify([{
                type: "fixed",
                power: "-0.75",
                axisRanges: [{
                    from: "0",
                    to: "180",
                    step: "10"
                }]
            }]),
            addPowers: JSON.stringify([{
                type: "fixed",
                value: "1.00",
                label: "LOW"
            }])
        }];

        const csv = Papa.unparse(templateData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'contact_lenses_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportCSV = () => {
        const csvData = lenses.map(lens => ({
            brand: lens.brand,
            name: lens.name,
            manufacturer: lens.manufacturer,
            material: lens.material,
            dkt: lens.dkt,
            modality: lens.modality,
            diameter: lens.diameter[0],
            baseCurve: lens.baseCurve[0],
            centreThickness: lens.centreThickness,
            type: lens.type,
            blueLight: lens.blueLight,
            spherePowers: JSON.stringify(lens.spherePowers),
            cylinderPowers: JSON.stringify(lens.cylinderPowers),
            addPowers: JSON.stringify(lens.addPowers)
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'contact_lenses.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importCSV = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: async (results) => {
                    try {
                        console.log('Parsed CSV data:', results.data);
                        for (const row of results.data) {
                            if (row.brand) {  // Skip empty rows
                                const lensData = {
                                    ...row,
                                    diameter: [parseFloat(row.diameter)],
                                    baseCurve: [parseFloat(row.baseCurve)],
                                    dkt: parseFloat(row.dkt),
                                    centreThickness: parseFloat(row.centreThickness),
                                    blueLight: row.blueLight === 'true',
                                    spherePowers: JSON.parse(row.spherePowers || '[]'),
                                    cylinderPowers: JSON.parse(row.cylinderPowers || '[]'),
                                    addPowers: JSON.parse(row.addPowers || '[]')
                                };
                                console.log('Attempting to create lens:', lensData);
                                await createLens(lensData);
                            }
                        }
                        showSnackbar('CSV imported successfully');
                        fetchLenses();
                    } catch (error) {
                        console.error('CSV import error:', error);
                        showSnackbar(`Error importing CSV: ${error.response?.data?.message || error.message}`, 'error');
                    }
                },
                header: true,
                error: (error) => {
                    console.error('CSV parsing error:', error);
                    showSnackbar('Error parsing CSV file', 'error');
                }
            });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Contact Lens Database
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={downloadTemplate}
                        sx={{ mr: 1 }}
                    >
                        Download Template
                    </Button>
                    <input
                        accept=".csv"
                        id="csv-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={importCSV}
                    />
                    <label htmlFor="csv-upload">
                        <Button
                            component="span"
                            variant="contained"
                            startIcon={<UploadIcon />}
                            sx={{ mr: 1 }}
                        >
                            Import CSV
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={exportCSV}
                        sx={{ mr: 1 }}
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add New Lens
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Brand</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Manufacturer</TableCell>
                            <TableCell>Material</TableCell>
                            <TableCell>Modality</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lenses.map((lens) => (
                            <TableRow key={lens._id}>
                                <TableCell>{lens.brand}</TableCell>
                                <TableCell>{lens.name}</TableCell>
                                <TableCell>{lens.manufacturer}</TableCell>
                                <TableCell>{lens.material}</TableCell>
                                <TableCell>{lens.modality}</TableCell>
                                <TableCell>{lens.type}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(lens)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(lens._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedLens ? 'Edit Contact Lens' : 'Add New Contact Lens'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {/* Basic Information */}
                        <Typography variant="h6">Basic Information</Typography>
                        <TextField
                            fullWidth
                            label="Brand"
                            margin="normal"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Name"
                            margin="normal"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Manufacturer"
                            margin="normal"
                            value={formData.manufacturer}
                            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Material"
                            margin="normal"
                            value={formData.material}
                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Modality"
                            margin="normal"
                            value={formData.modality}
                            onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                        >
                            {modalityOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Technical Specifications */}
                        <Typography variant="h6" sx={{ mt: 2 }}>Technical Specifications</Typography>
                        <TextField
                            fullWidth
                            label="DK/t"
                            type="number"
                            margin="normal"
                            value={formData.dkt}
                            onChange={(e) => setFormData({ ...formData, dkt: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Diameter"
                            type="number"
                            margin="normal"
                            value={formData.diameter}
                            onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Base Curve"
                            type="number"
                            margin="normal"
                            value={formData.baseCurve}
                            onChange={(e) => setFormData({ ...formData, baseCurve: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Centre Thickness"
                            type="number"
                            margin="normal"
                            value={formData.centreThickness}
                            onChange={(e) => setFormData({ ...formData, centreThickness: e.target.value })}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.blueLight}
                                    onChange={(e) => setFormData({ ...formData, blueLight: e.target.checked })}
                                />
                            }
                            label="Blue Light Filter"
                            sx={{ mt: 1 }}
                        />

                        {/* Prescription Parameters */}
                        <Typography variant="h6" sx={{ mt: 2 }}>Prescription Parameters</Typography>
                        <TextField
                            select
                            fullWidth
                            label="Lens Type"
                            margin="normal"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            {typeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Sphere Powers */}
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Sphere Powers</Typography>
                        {formData.spherePowers.map((range, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1, my: 1 }}>
                                <TextField
                                    label="Min"
                                    type="number"
                                    value={range.min}
                                    onChange={(e) => updateSphereRange(index, 'min', e.target.value)}
                                    sx={{ width: '30%' }}
                                />
                                <TextField
                                    label="Max"
                                    type="number"
                                    value={range.max}
                                    onChange={(e) => updateSphereRange(index, 'max', e.target.value)}
                                    sx={{ width: '30%' }}
                                />
                                <TextField
                                    label="Steps"
                                    type="number"
                                    value={range.steps}
                                    onChange={(e) => updateSphereRange(index, 'steps', e.target.value)}
                                    sx={{ width: '30%' }}
                                />
                                {formData.spherePowers.length > 1 && (
                                    <IconButton onClick={() => removeSphereRange(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={addSphereRange} sx={{ mt: 1 }}>
                            Add Sphere Range
                        </Button>

                        {/* Cylinder Powers */}
                        {(formData.type === 'Toric' || formData.type === 'MultifocalToric') && (
                            <>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>Cylinder Powers</Typography>
                                {formData.cylinderPowers.map((cylinder, cylinderIndex) => (
                                    <Box key={cylinderIndex} sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                        <TextField
                                            select
                                            label="Type"
                                            value={cylinder.type}
                                            onChange={(e) => updateCylinderPower(cylinderIndex, 'type', e.target.value)}
                                            sx={{ width: '200px', mb: 2 }}
                                        >
                                            <MenuItem value="fixed">Fixed</MenuItem>
                                            <MenuItem value="range">Range</MenuItem>
                                        </TextField>

                                        {cylinder.type === 'fixed' ? (
                                            <TextField
                                                label="Power"
                                                type="number"
                                                value={cylinder.power}
                                                onChange={(e) => updateCylinderPower(cylinderIndex, 'power', e.target.value)}
                                                sx={{ width: '200px', ml: 2 }}
                                            />
                                        ) : (
                                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                <TextField
                                                    label="Min"
                                                    type="number"
                                                    value={cylinder.min}
                                                    onChange={(e) => updateCylinderPower(cylinderIndex, 'min', e.target.value)}
                                                />
                                                <TextField
                                                    label="Max"
                                                    type="number"
                                                    value={cylinder.max}
                                                    onChange={(e) => updateCylinderPower(cylinderIndex, 'max', e.target.value)}
                                                />
                                                <TextField
                                                    label="Steps"
                                                    type="number"
                                                    value={cylinder.steps}
                                                    onChange={(e) => updateCylinderPower(cylinderIndex, 'steps', e.target.value)}
                                                />
                                            </Box>
                                        )}

                                        {/* Axis Ranges */}
                                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Axis Ranges</Typography>
                                        {cylinder.axisRanges.map((axis, axisIndex) => (
                                            <Box key={axisIndex} sx={{ display: 'flex', gap: 2, my: 1 }}>
                                                <TextField
                                                    label="From"
                                                    type="number"
                                                    value={axis.from}
                                                    onChange={(e) => updateAxisRange(cylinderIndex, axisIndex, 'from', e.target.value)}
                                                />
                                                <TextField
                                                    label="To"
                                                    type="number"
                                                    value={axis.to}
                                                    onChange={(e) => updateAxisRange(cylinderIndex, axisIndex, 'to', e.target.value)}
                                                />
                                                <TextField
                                                    label="Step"
                                                    type="number"
                                                    value={axis.step}
                                                    onChange={(e) => updateAxisRange(cylinderIndex, axisIndex, 'step', e.target.value)}
                                                />
                                            </Box>
                                        ))}
                                        <Button startIcon={<AddIcon />} onClick={() => addAxisRange(cylinderIndex)} sx={{ mt: 1 }}>
                                            Add Axis Range
                                        </Button>
                                    </Box>
                                ))}
                                <Button startIcon={<AddIcon />} onClick={addCylinderPower} sx={{ mt: 1 }}>
                                    Add Cylinder Power
                                </Button>
                            </>
                        )}

                        {/* ADD Powers */}
                        {(formData.type === 'Multifocal' || formData.type === 'MultifocalToric') && (
                            <>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>ADD Powers</Typography>
                                {formData.addPowers.map((add, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 2, my: 1 }}>
                                        <TextField
                                            label="Value"
                                            type="number"
                                            value={add.value}
                                            onChange={(e) => updateAddPower(index, 'value', e.target.value)}
                                        />
                                        <TextField
                                            label="Label"
                                            value={add.label}
                                            onChange={(e) => updateAddPower(index, 'label', e.target.value)}
                                        />
                                        {formData.addPowers.length > 1 && (
                                            <IconButton onClick={() => removeAddPower(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                                <Button startIcon={<AddIcon />} onClick={addAddPower} sx={{ mt: 1 }}>
                                    Add ADD Power
                                </Button>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedLens ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Dashboard;