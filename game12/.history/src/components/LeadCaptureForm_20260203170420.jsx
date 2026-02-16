
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { isValidEmail, isValidPhone } from '../utils/helpers';
import { Check, ChevronsUpDown } from "lucide-react";

// API function to submit to Bajaj LMS
const submitToLMS = async (data) => {
    console.log("Submitting to LMS:", data);
    ; //   point 1: Before API call

    const apiUrl = "https://webpartner.bajajallianz.com/EurekaWSNew/service/pushData";

    // Complete payload with all required fields
    const fullPayload = {
        name: data.name,
        age: data.age || 25,
        mobile_no: data.mobile_no,
        email_id: data.email_id,
        goal_name: data.goal_name || "1",
        param1: null,
        param2: null,
        param3: null,
        param4: data.param4, // pincode
        param5: "",
        param13: "",
        param18: "",
        param19: data.param19, // DOB
        param20: "",
        param23: data.param23, // gender
        param24: data.param24, // occupation
        param25: data.param25, // education
        param26: data.param26, // income
        param36: "manual",
        summary_dtls: "",
        p_user_eml: data.email_id,
        p_data_source: data.p_data_source || "WS_ETOUCH_BUY",
        p_curr_page_path: "https://www.bajajlifeinsurance.com/etouch/",
        p_ip_addsr: "",
        p_remark_url: "",
        prodId: data.prodId || "345",
        medium: "",
        contact_number: "",
        content: "",
        campaign: "",
        source: "",
        keyword: "",
        flag: "",
        parameter: "",
        name1: "",
        param28: "",
        param29: "",
        param30: ""
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "Origin": "https://www.bajajlifeinsurance.com",
                "Referer": "https://www.bajajlifeinsurance.com/"
            },
            body: JSON.stringify(fullPayload)
        });

        ; //   point 2: After API response

        const result = await response.json();
        console.log("LMS Response:", result);

        return result;
    } catch (error) {
        console.error("LMS API Error:", error);
        ; //   point 3: On error
        throw error;
    }
};

const LeadCaptureForm = ({ onSubmit, onSkip }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        pincode: '',
        dob: '', // YYYY-MM-DD from input
        gender: '',
        occupation: '',
        education: '',
        income: '',
        nri: 'no' // default
    });
    const [errors, setErrors] = useState({});

    // Field Configs
    const incomeOptions = [
        { label: "Below 3 Lac", value: "200000" },
        { label: "3 - 5 Lac", value: "400000" },
        { label: "5 - 7 Lac", value: "600000" },
        { label: "7 - 10 Lac", value: "800000" },
        { label: "10 - 15 Lac", value: "1200000" },
        { label: "15 Lac +", value: "1800000" }
    ];

    const genderOptions = [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" },
        { label: "Others", value: "O" }
    ];

    const occupationOptions = [
        { label: "Salaried (Others)", value: "SN" },
        { label: "Salaried (Govt)", value: "SG" },
        { label: "Business", value: "SE" },
        { label: "Professional", value: "SP" } // Assuming SP for Professional
    ];

    const educationOptions = [
        { label: "Masters & Above", value: "PG" },
        { label: "Graduation", value: "GR" },
        { label: "Diploma", value: "DP" },
        { label: "HSC", value: "HSC" }
    ];

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Full Name is required";
        if (!isValidPhone(formData.mobile)) newErrors.mobile = "Valid 10-digit number required";
        if (!isValidEmail(formData.email)) newErrors.email = "Valid email required";
        if (formData.pincode.length !== 6) newErrors.pincode = "Valid 6-digit pincode required";
        if (!formData.dob) newErrors.dob = "Date of Birth is required";

        // Simple age check (18+)
        const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
        if (age < 18) newErrors.dob = "You must be at least 18 years old";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.occupation) newErrors.occupation = "Occupation is required";
        if (!formData.education) newErrors.education = "Education is required";
        if (!formData.income) newErrors.income = "Income is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        ; //   point 0: Button clicked
        console.log("handleSubmit called with formData:", formData);

        if (!validateStep2()) return;

        setIsLoading(true);

        // Format Date for API (MM-DD-YYYY)
        const [year, month, day] = formData.dob.split('-');
        const formattedDob = `${month}-${day}-${year}`;

        // Map data to LMS JSON structure
        const lmsPayload = {
            name: formData.name,
            mobile_no: formData.mobile,
            email_id: formData.email,
            param4: formData.pincode,
            param19: formattedDob,
            param23: formData.gender,
            param24: formData.occupation,
            param25: formData.education,
            param26: formData.income,
            prodId: "345",
            goal_name: "1",
            p_data_source: "WS_ETOUCH_BUY"
        };

        // Simulate API call
        try {
            await submitToLMS(lmsPayload);
            onSubmit(lmsPayload); // Propagate up to App
        } catch (error) {
            console.error("Submission error", error);
            setErrors({ submit: "Failed to submit. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="w-full max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="shadow-2xl border-brand-blue/10 dark:border-brand-blue/20">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        {step === 1 ? "Just a few details" : "Almost there!"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1
                            ? "We need this to calculate your personalized quote."
                            : "Help us understand your profile better."}
                    </CardDescription>
                    {/* Progress Indicator */}
                    <div className="flex justify-center gap-2 mt-2">
                        <div className={`h-1.5 w-16 rounded-full transition-colors ${step === 1 ? 'bg-brand-orange' : 'bg-muted'}`} />
                        <div className={`h-1.5 w-16 rounded-full transition-colors ${step === 2 ? 'bg-brand-orange' : 'bg-muted'}`} />
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <form className="space-y-4">
                        {step === 1 && (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-4"
                            >
                                {/* Form Fields Step 1 */}
                                <div className="space-y-1">
                                    <Label htmlFor="nri">Are you an NRI?</Label>
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant={formData.nri === 'yes' ? 'brand' : 'outline'}
                                            onClick={() => updateField('nri', 'yes')}
                                            className="w-1/2"
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={formData.nri === 'no' ? 'brand' : 'outline'}
                                            onClick={() => updateField('nri', 'no')}
                                            className="w-1/2"
                                        >
                                            No
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        placeholder="As per Govt ID"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="dob">Date of Birth <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="dob"
                                            type="date"
                                            value={formData.dob}
                                            onChange={(e) => updateField('dob', e.target.value)}
                                            className={errors.dob ? 'border-red-500' : ''}
                                        />
                                        {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="pincode"
                                            maxLength={6}
                                            placeholder="110001"
                                            value={formData.pincode}
                                            onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, ''))}
                                            className={errors.pincode ? 'border-red-500' : ''}
                                        />
                                        {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
                                    <div className="flex gap-2">
                                        <div className="bg-muted flex items-center px-3 rounded-md border border-input text-muted-foreground text-sm font-medium">
                                            +91
                                        </div>
                                        <Input
                                            id="mobile"
                                            type="tel"
                                            maxLength={10}
                                            placeholder="9876543210"
                                            value={formData.mobile}
                                            onChange={(e) => updateField('mobile', e.target.value.replace(/\D/g, ''))}
                                            className={errors.mobile ? 'border-red-500' : ''}
                                        />
                                    </div>
                                    {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="email">Email ID <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                </div>

                                <Button onClick={handleNext} className="w-full bg-brand-orange hover:bg-orange-600 text-lg text-white">
                                    Proceed
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-5"
                            >
                                {/* Form Fields Step 2 */}

                                <div className="space-y-2">
                                    <Label>Gender <span className="text-red-500">*</span></Label>
                                    <div className="flex rounded-md overflow-hidden border border-input">
                                        {genderOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => updateField('gender', opt.value)}
                                                className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.gender === opt.value
                                                    ? 'bg-brand-blue text-white'
                                                    : 'bg-background text-foreground hover:bg-muted'
                                                    } ${opt.value !== 'O' ? 'border-r border-input' : ''
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Occupation <span className="text-red-500">*</span></Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {occupationOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => updateField('occupation', opt.value)}
                                                className={`py-2 px-3 text-sm font-medium rounded-md border transition-all ${formData.occupation === opt.value
                                                    ? 'bg-brand-blue text-white border-brand-blue'
                                                    : 'bg-background text-foreground border-input hover:bg-muted'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.occupation && <p className="text-red-500 text-xs">{errors.occupation}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Education <span className="text-red-500">*</span></Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {educationOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => updateField('education', opt.value)}
                                                className={`py-2 px-3 text-sm font-medium rounded-md border transition-all ${formData.education === opt.value
                                                    ? 'bg-brand-blue text-white border-brand-blue'
                                                    : 'bg-background text-foreground border-input hover:bg-muted'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.education && <p className="text-red-500 text-xs">{errors.education}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Annual Income <span className="text-red-500">*</span></Label>
                                    <select
                                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue ${errors.income ? 'border-red-500' : ''}`}
                                        value={formData.income}
                                        onChange={(e) => updateField('income', e.target.value)}
                                    >
                                        <option value="">Select Annual Income</option>
                                        {incomeOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {errors.income && <p className="text-red-500 text-xs">{errors.income}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-1/3"
                                        onClick={() => setStep(1)}
                                        disabled={isLoading}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-2/3 bg-brand-orange hover:bg-orange-600 text-lg text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Submitting..." : "Get Quote"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        <div className="text-center">
                            <Button
                                type="button"
                                variant="link"
                                className="text-muted-foreground text-xs mt-2"
                                onClick={onSkip}
                            >
                                Skip and restart quiz
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default LeadCaptureForm;
