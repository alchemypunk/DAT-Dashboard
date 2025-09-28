import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { X, Plus, ArrowLeft, Send } from "lucide-react";

interface PreAuthorizationFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function PreAuthorizationForm({ onBack, onSubmit }: PreAuthorizationFormProps) {
  const [formData, setFormData] = useState({
    doctorName: '',
    registrationId: '',
    specialization: '',
    estimatedCost: '',
    diagnosisNotes: [] as string[],
  });

  const [currentNote, setCurrentNote] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addDiagnosisNote = () => {
    if (currentNote.trim()) {
      setFormData(prev => ({
        ...prev,
        diagnosisNotes: [...prev.diagnosisNotes, currentNote.trim()]
      }));
      setCurrentNote('');
    }
  };

  const removeDiagnosisNote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      diagnosisNotes: prev.diagnosisNotes.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDiagnosisNote();
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.doctorName || !formData.registrationId || !formData.specialization || !formData.estimatedCost) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Pre-Authorization Details</h2>
          <p className="text-slate-600 mt-1">Additional information required for pre-authorization requests</p>
        </div>
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Claim Form</span>
        </Button>
      </div>

      {/* Pre-Authorization Notice */}
      <Card className="bg-blue-50 border border-blue-200 rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-medium">ℹ</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Pre-Authorization Required</h4>
              <p className="text-sm text-blue-700">
                This request will be reviewed by our medical team within 48-72 hours. You will receive a notification once the decision is made.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form className="space-y-6">
        {/* Doctor Details */}
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Doctor Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor Name *</Label>
                <Input 
                  id="doctorName"
                  placeholder="Dr. John Smith"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationId">Medical Registration ID *</Label>
                <Input 
                  id="registrationId"
                  placeholder="MR123456789"
                  value={formData.registrationId}
                  onChange={(e) => handleInputChange('registrationId', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Input 
                id="specialization"
                placeholder="e.g., Cardiology, Orthopedics, Neurology"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Treatment Cost */}
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Treatment Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                <Input 
                  id="estimatedCost"
                  type="number"
                  placeholder="0.00"
                  value={formData.estimatedCost}
                  onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-sm text-slate-600">
                Enter the total estimated cost for the proposed treatment
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Notes */}
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Diagnosis Notes</CardTitle>
            <p className="text-sm text-slate-600">
              Add specific diagnosis codes, symptoms, or treatment notes
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Note Input */}
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter diagnosis note, ICD code, or symptom"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addDiagnosisNote}
                disabled={!currentNote.trim()}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>

            {/* Notes Display */}
            {formData.diagnosisNotes.length > 0 && (
              <div className="space-y-2">
                <Label>Added Notes ({formData.diagnosisNotes.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.diagnosisNotes.map((note, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 flex items-center space-x-2"
                    >
                      <span>{note}</span>
                      <button
                        type="button"
                        onClick={() => removeDiagnosisNote(index)}
                        className="text-slate-400 hover:text-red-500 ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Common Diagnosis Suggestions */}
            <div className="space-y-2">
              <Label className="text-sm">Common Diagnosis Codes</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'I10 - Essential Hypertension',
                  'E11.9 - Type 2 Diabetes',
                  'M25.511 - Pain in right shoulder',
                  'Z51.11 - Chemotherapy',
                  'S72.001A - Fracture of femur',
                  'F32.9 - Depression',
                ].map((code) => (
                  <Button
                    key={code}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentNote(code);
                      addDiagnosisNote();
                    }}
                    className="text-xs text-left justify-start h-auto py-2 px-3"
                  >
                    {code}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Comments (Optional)</Label>
              <Textarea 
                id="additionalInfo"
                placeholder="Any additional information that might help with the pre-authorization process"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Claim Form</span>
          </Button>
          
          <Button 
            type="button"
            onClick={handleSubmit}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
            <span>Submit Pre-Authorization Request</span>
          </Button>
        </div>
      </form>
    </div>
  );
}