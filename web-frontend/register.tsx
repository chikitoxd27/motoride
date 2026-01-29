import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TextInputProps } from "react-native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const resolveApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoClient?.hostUri ??
    Constants.manifest?.debuggerHost;

  if (!hostUri) {
    return "http://localhost:5000/api";
  }

  const hostname = hostUri.split(":")[0];
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0"
  ) {
    return "http://localhost:5000/api";
  }

  return `http://${hostname}:5000/api`;
};

const API_BASE_URL = resolveApiBaseUrl();
const PSGC_API_BASE = "https://psgc.gitlab.io/api";

type Attachment = {
  uri: string;
  base64?: string;
  mimeType?: string;
} | null;

type SelectionOption = {
  label: string;
  value: string;
  subtitle?: string;
  meta?: {
    displayName?: string;
    regionCode?: string;
    provinceCode?: string;
    municipalityCode?: string;
    barangayCode?: string;
    [key: string]: string | undefined;
  };
};
type SelectionKind =
  | "accountRegion"
  | "vehicleType"
  | "addressRegion"
  | "province"
  | "municipality"
  | "barangay";

type Address = {
  region: string;
  regionCode: string;
  province: string;
  provinceCode: string;
  municipality: string;
  municipalityCode: string;
  barangay: string;
  barangayCode: string;
  zipCode: string;
  houseNumber: string;
  street: string;
};

type PsgcRegion = {
  code: string;
  name: string;
  regionName?: string;
};

type PsgcProvince = {
  code: string;
  name: string;
  regionCode: string;
};

type PsgcCityMunicipality = {
  code: string;
  name: string;
  provinceCode: string;
  isCity: boolean;
  isMunicipality: boolean;
};

type PsgcCityMunicipalityDetail = PsgcCityMunicipality & {
  zipCode?: string;
};

type PsgcBarangay = {
  code: string;
  name: string;
  cityCode?: string;
  municipalityCode?: string;
};

type FormState = {
  accountInfo: {
    mobileNumber: string;
    region: string;
    vehicleType: string;
    employmentType: "full-time" | "part-time";
  };
  personalInfo: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    sex: "male" | "female" | "prefer-not-to-answer";
    address: Address;
    profilePhoto: Attachment;
  };
  driversLicense: {
    dlNumber: string;
    dlExpiry: string;
    frontImage: Attachment;
    backImage: Attachment;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
    plateNumber: string;
  };
  vehicleDocuments: {
    registrationNumber: string;
    registrationExpiry: string;
    orCrImage: Attachment;
  };
  vehiclePhotos: {
    front: Attachment;
    rear: Attachment;
  };
  vehicleOwnership: {
    ownerName: string;
    ownershipType: "owned" | "company" | "rented";
    supportingDoc: Attachment;
  };
  governmentIds: {
    tinNumber: string;
    sssNumber: string;
  };
};

const createInitialFormState = (): FormState => ({
  accountInfo: {
    mobileNumber: "",
    region: "",
    vehicleType: "",
    employmentType: "full-time",
  },
  personalInfo: {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    sex: "male",
    address: {
      region: "",
      regionCode: "",
      province: "",
      provinceCode: "",
      municipality: "",
      municipalityCode: "",
      barangay: "",
      barangayCode: "",
      zipCode: "",
      houseNumber: "",
      street: "",
    },
    profilePhoto: null,
  },
  driversLicense: {
    dlNumber: "",
    dlExpiry: "",
    frontImage: null,
    backImage: null,
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phoneNumber: "",
  },
  vehicleInfo: {
    make: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
  },
  vehicleDocuments: {
    registrationNumber: "",
    registrationExpiry: "",
    orCrImage: null,
  },
  vehiclePhotos: {
    front: null,
    rear: null,
  },
  vehicleOwnership: {
    ownerName: "",
    ownershipType: "owned",
    supportingDoc: null,
  },
  governmentIds: {
    tinNumber: "",
    sssNumber: "",
  },
});

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

type LabeledInputProps = {
  label: string;
  multiline?: boolean;
} & TextInputProps;

const LabeledInput = ({
  label,
  multiline,
  editable = true,
  ...props
}: LabeledInputProps) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        multiline && styles.multilineInput,
        editable === false && styles.disabledInput,
      ]}
      editable={editable}
      placeholderTextColor="#999"
      multiline={multiline}
      {...props}
    />
  </View>
);

const AttachmentPicker = ({
  label,
  value,
  onPick,
}: {
  label: string;
  value: Attachment;
  onPick: () => void;
}) => (
  <View style={styles.attachmentRow}>
    <View style={styles.attachmentInfo}>
      <Text style={styles.label}>{label}</Text>
      {value?.uri ? (
        <Image source={{ uri: value.uri }} style={styles.attachmentPreview} />
      ) : (
        <Text style={styles.attachmentPlaceholder}>No file selected</Text>
      )}
    </View>
    <TouchableOpacity style={styles.secondaryButton} onPress={onPick}>
      <Text style={styles.secondaryButtonText}>
        {value ? "Replace" : "Upload"}
      </Text>
    </TouchableOpacity>
  </View>
);

const SelectField = ({
  label,
  value,
  placeholder,
  onPress,
  disabled,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.selectField, disabled && styles.selectFieldDisabled]}
    onPress={disabled ? undefined : onPress}
    activeOpacity={disabled ? 1 : 0.8}
  >
    <Text style={styles.label}>{label}</Text>
    <View style={styles.selectFieldValueContainer}>
      <Text
        style={value ? styles.selectFieldValue : styles.selectFieldPlaceholder}
      >
        {value || placeholder}
      </Text>
      <MaterialCommunityIcons
        name="chevron-down"
        size={20}
        color={disabled ? "#ccc" : "#555"}
      />
    </View>
  </TouchableOpacity>
);

const OptionPill = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.pill, selected && styles.pillSelected]}
    onPress={onPress}
  >
    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ProfilePhotoCard = ({
  value,
  onCapture,
  onUpload,
}: {
  value: Attachment;
  onCapture: () => void;
  onUpload: () => void;
}) => (
  <View style={styles.profilePhotoCard}>
    {value?.uri ? (
      <Image source={{ uri: value.uri }} style={styles.profilePhoto} />
    ) : (
      <View style={styles.profilePhotoPlaceholder}>
        <MaterialCommunityIcons name="camera" size={28} color="#999" />
        <Text style={styles.attachmentPlaceholder}>No photo selected</Text>
      </View>
    )}
    <View style={styles.profilePhotoActions}>
      <TouchableOpacity style={styles.secondaryButton} onPress={onCapture}>
        <Text style={styles.secondaryButtonText}>Take photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onUpload}>
        <Text style={styles.secondaryButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SelectionModal = ({
  visible,
  title,
  options,
  loading,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: SelectionOption[];
  loading?: boolean;
  onSelect: (option: SelectionOption) => void;
  onClose: () => void;
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={22} color="#111" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.modalLoader}>
            <ActivityIndicator color="#1E90FF" />
            <Text style={styles.modalSubtitle}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.modalItemLabel}>{item.label}</Text>
                {item.subtitle ? (
                  <Text style={styles.modalSubtitle}>{item.subtitle}</Text>
                ) : null}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.modalSubtitle}>No options available</Text>
            }
          />
        )}
      </View>
    </View>
  </Modal>
);

const VEHICLE_TYPE_OPTIONS: SelectionOption[] = [
  { label: "Motorcycle", value: "Motorcycle" },
  { label: "Scooter", value: "Scooter" },
  { label: "Tricycle", value: "Tricycle" },
  { label: "Car", value: "Car" },
  { label: "Van", value: "Van" },
];

const MUNICIPALITY_ZIP_FALLBACK: Record<string, string> = {};
const BARANGAY_ZIP_FALLBACK: Record<string, string> = {};

export default function RegisterScreen() {
  const [formData, setFormData] = useState<FormState>(createInitialFormState());
  const [submitting, setSubmitting] = useState(false);
  const [selectionKind, setSelectionKind] = useState<SelectionKind | null>(
    null,
  );
  const [selectionOptions, setSelectionOptions] = useState<SelectionOption[]>(
    [],
  );
  const [selectionVisible, setSelectionVisible] = useState(false);
  const [selectionLoading, setSelectionLoading] = useState(false);

  const [regions, setRegions] = useState<PsgcRegion[]>([]);
  const provincesCache = useRef<Record<string, PsgcProvince[]>>({});
  const municipalitiesCache = useRef<Record<string, PsgcCityMunicipality[]>>(
    {},
  );
  const barangaysCache = useRef<Record<string, PsgcBarangay[]>>({});
  const municipalityDetailsCache = useRef<
    Record<string, PsgcCityMunicipalityDetail>
  >({});

  const employmentOptions = useMemo(
    () => [
      { value: "full-time", label: "Full-time" },
      { value: "part-time", label: "Part-time" },
    ],
    [],
  );

  const sexOptions = useMemo(
    () => [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "prefer-not-to-answer", label: "Prefer not to say" },
    ],
    [],
  );

  const ownershipOptions = useMemo(
    () => [
      { value: "owned", label: "Owned" },
      { value: "company", label: "Company" },
      { value: "rented", label: "Rented" },
    ],
    [],
  );

  const personalAddress = formData.personalInfo.address;

  const fetchJson = useCallback(async <T,>(url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return (await response.json()) as T;
  }, []);

  const ensureRegions = useCallback(async () => {
    if (regions.length) return regions;
    const data = await fetchJson<PsgcRegion[]>(`${PSGC_API_BASE}/regions/`);
    setRegions(data);
    return data;
  }, [fetchJson, regions]);

  const loadProvinces = useCallback(
    async (regionCode: string) => {
      if (!provincesCache.current[regionCode]) {
        provincesCache.current[regionCode] = await fetchJson<PsgcProvince[]>(
          `${PSGC_API_BASE}/regions/${regionCode}/provinces/`,
        );
      }
      return provincesCache.current[regionCode];
    },
    [fetchJson],
  );

  const loadMunicipalities = useCallback(
    async (provinceCode: string) => {
      if (!municipalitiesCache.current[provinceCode]) {
        municipalitiesCache.current[provinceCode] = await fetchJson<
          PsgcCityMunicipality[]
        >(`${PSGC_API_BASE}/provinces/${provinceCode}/cities-municipalities/`);
      }
      return municipalitiesCache.current[provinceCode];
    },
    [fetchJson],
  );

  const loadBarangays = useCallback(
    async (municipalityCode: string) => {
      if (!barangaysCache.current[municipalityCode]) {
        barangaysCache.current[municipalityCode] = await fetchJson<
          PsgcBarangay[]
        >(
          `${PSGC_API_BASE}/cities-municipalities/${municipalityCode}/barangays/`,
        );
      }
      return barangaysCache.current[municipalityCode];
    },
    [fetchJson],
  );

  useEffect(() => {
    ensureRegions().catch((error) => {
      console.warn("Failed to preload regions", error);
    });
  }, [ensureRegions]);

  const updateField = (
    section: keyof FormState,
    field: string,
    value: unknown,
  ) => {
    setFormData((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const updateAddress = (updates: Partial<Address>) => {
    setFormData((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        address: {
          ...current.personalInfo.address,
          ...updates,
        },
      },
    }));
  };

  const buildOptions = useCallback(
    async (kind: SelectionKind): Promise<SelectionOption[]> => {
      switch (kind) {
        case "vehicleType":
          return VEHICLE_TYPE_OPTIONS;
        case "accountRegion": {
          const regionList = await ensureRegions();
          return regionList
            .map((region) => region.regionName ?? region.name)
            .sort()
            .map((name) => ({ label: name, value: name }));
        }
        case "addressRegion": {
          const regionList = await ensureRegions();
          return regionList
            .map((region) => ({
              label: region.regionName ?? region.name,
              value: region.code,
              meta: {
                displayName: region.regionName ?? region.name,
                regionCode: region.code,
              },
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        }
        case "province":
          if (!personalAddress.regionCode) return [];
          return (await loadProvinces(personalAddress.regionCode))
            .map((province) => ({
              label: province.name,
              value: province.code,
              meta: {
                displayName: province.name,
                provinceCode: province.code,
                regionCode: province.regionCode,
              },
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        case "municipality":
          if (!personalAddress.provinceCode) return [];
          return (
            await Promise.all(
              (await loadMunicipalities(personalAddress.provinceCode)).map(
                async (municipality) => {
                  return {
                    label: municipality.name,
                    value: municipality.code,
                    meta: {
                      displayName: municipality.name,
                      municipalityCode: municipality.code,
                      provinceCode: municipality.provinceCode,
                    },
                  } satisfies SelectionOption;
                },
              ),
            )
          ).sort((a, b) => a.label.localeCompare(b.label));
        case "barangay":
          if (!personalAddress.municipalityCode) return [];
          return (await loadBarangays(personalAddress.municipalityCode))
            .map((barangay) => ({
              label: barangay.name,
              value: barangay.code,
              meta: {
                displayName: barangay.name,
                barangayCode: barangay.code,
                municipalityCode: personalAddress.municipalityCode,
              },
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        default:
          return [];
      }
    },
    [
      ensureRegions,
      loadProvinces,
      loadMunicipalities,
      loadBarangays,
      personalAddress.regionCode,
      personalAddress.provinceCode,
      personalAddress.municipalityCode,
    ],
  );

  const openSelection = useCallback(
    async (kind: SelectionKind) => {
      if (
        (kind === "province" && !personalAddress.regionCode) ||
        (kind === "municipality" && !personalAddress.provinceCode) ||
        (kind === "barangay" && !personalAddress.municipalityCode)
      ) {
        Alert.alert(
          "Incomplete address",
          "Please select the previous field first.",
        );
        return;
      }

      setSelectionKind(kind);
      setSelectionVisible(true);
      setSelectionLoading(true);
      setSelectionOptions([]);

      try {
        const options = await buildOptions(kind);
        if (!options.length) {
          Alert.alert(
            "No options",
            "No data is available for this selection yet.",
          );
          setSelectionVisible(false);
          setSelectionKind(null);
          return;
        }
        setSelectionOptions(options);
      } catch (error) {
        Alert.alert("Unable to load options", (error as Error).message);
        setSelectionVisible(false);
        setSelectionKind(null);
      } finally {
        setSelectionLoading(false);
      }
    },
    [
      buildOptions,
      personalAddress.regionCode,
      personalAddress.provinceCode,
      personalAddress.municipalityCode,
    ],
  );

  const handleSelectOption = (option: SelectionOption) => {
    if (!selectionKind) return;
    const displayName = option.meta?.displayName ?? option.label;
    switch (selectionKind) {
      case "accountRegion":
        updateField("accountInfo", "region", displayName);
        break;
      case "vehicleType":
        updateField("accountInfo", "vehicleType", displayName);
        break;
      case "addressRegion":
        updateAddress({
          region: displayName,
          regionCode: option.meta?.regionCode ?? option.value,
          province: "",
          provinceCode: "",
          municipality: "",
          municipalityCode: "",
          barangay: "",
          barangayCode: "",
          zipCode: "",
        });
        break;
      case "province":
        updateAddress({
          province: displayName,
          provinceCode: option.meta?.provinceCode ?? option.value,
          municipality: "",
          municipalityCode: "",
          barangay: "",
          barangayCode: "",
          zipCode: "",
        });
        break;
      case "municipality":
        {
          const municipalityCode =
            option.meta?.municipalityCode ?? option.value;
          updateAddress({
            municipality: displayName,
            municipalityCode,
            barangay: "",
            barangayCode: "",
            zipCode: "",
          });
        }
        break;
      case "barangay":
        updateAddress({
          barangay: displayName,
          barangayCode: option.meta?.barangayCode ?? option.value,
        });
        break;
    }
    setSelectionVisible(false);
    setSelectionKind(null);
  };

  const applyImageResult = (
    section: keyof FormState,
    field: string,
    asset: ImagePicker.ImagePickerAsset,
  ) => {
    const attachment: Attachment = {
      uri: asset.uri,
      base64: asset.base64 ?? undefined,
      mimeType: asset.mimeType ?? "image/jpeg",
    };

    if (section === "personalInfo" && field === "profilePhoto") {
      updateField("personalInfo", "profilePhoto", attachment);
      return;
    }

    setFormData((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, Attachment | string>),
        [field]: attachment,
      },
    }));
  };

  const pickImage = async (section: keyof FormState, field: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      applyImageResult(section, field, result.assets[0]);
    }
  };

  const captureImage = async (section: keyof FormState, field: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera needed", "Please grant camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      applyImageResult(section, field, result.assets[0]);
    }
  };

  const validateForm = () => {
    const requiredFields: {
      section: keyof FormState;
      field: string;
      label: string;
    }[] = [
      { section: "accountInfo", field: "mobileNumber", label: "Mobile number" },
      { section: "accountInfo", field: "region", label: "Region" },
      { section: "accountInfo", field: "vehicleType", label: "Vehicle type" },
      { section: "personalInfo", field: "firstName", label: "First name" },
      { section: "personalInfo", field: "lastName", label: "Last name" },
      { section: "personalInfo", field: "email", label: "Email" },
      { section: "personalInfo", field: "dateOfBirth", label: "Date of birth" },
      {
        section: "driversLicense",
        field: "dlNumber",
        label: "Driver's license number",
      },
      {
        section: "driversLicense",
        field: "dlExpiry",
        label: "Driver's license expiry",
      },
      {
        section: "emergencyContact",
        field: "name",
        label: "Emergency contact name",
      },
      {
        section: "emergencyContact",
        field: "phoneNumber",
        label: "Emergency contact number",
      },
      { section: "governmentIds", field: "tinNumber", label: "TIN number" },
      { section: "governmentIds", field: "sssNumber", label: "SSS number" },
    ];

    const missing = requiredFields.filter(({ section, field }) => {
      const value = (formData as Record<string, any>)[section][field];
      return !value;
    });

    if (missing.length) {
      Alert.alert(
        "Incomplete form",
        `Please provide: ${missing.map((item) => item.label).join(", ")}`,
      );
      return false;
    }

    const addressRequired = ["region", "province", "municipality", "barangay"];
    const addressMissing = addressRequired.filter(
      (key) => !(personalAddress as any)[key],
    );
    if (addressMissing.length) {
      Alert.alert("Complete address", `Missing: ${addressMissing.join(", ")}`);
      return false;
    }

    if (!formData.personalInfo.profilePhoto) {
      Alert.alert(
        "Profile photo",
        "Please upload or capture your profile photo.",
      );
      return false;
    }

    if (
      !formData.driversLicense.frontImage ||
      !formData.driversLicense.backImage
    ) {
      Alert.alert(
        "Driver's license",
        "Upload front and back images of your license.",
      );
      return false;
    }

    if (!formData.vehicleDocuments.orCrImage) {
      Alert.alert("Vehicle document", "Upload your OR/CR copy.");
      return false;
    }

    if (!formData.vehiclePhotos.front || !formData.vehiclePhotos.rear) {
      Alert.alert(
        "Vehicle photos",
        "Upload front and rear photos of your vehicle.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/driver-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      Alert.alert(
        "Application submitted",
        "We will review your information soon.",
      );
      setFormData(createInitialFormState());
    } catch (error) {
      Alert.alert("Submission failed", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <MaterialCommunityIcons
        name="motorbike"
        size={96}
        color="#1E90FF"
        style={styles.logo}
      />
      <Text style={styles.title}>Apply as a MotoRide Driver</Text>

      <Section title="Account information">
        <LabeledInput
          label="Mobile number"
          keyboardType="phone-pad"
          placeholder="e.g. +63 917 123 4567"
          value={formData.accountInfo.mobileNumber}
          onChangeText={(text) =>
            updateField("accountInfo", "mobileNumber", text)
          }
        />
        <SelectField
          label="Region"
          placeholder="Select region"
          value={formData.accountInfo.region}
          onPress={() => openSelection("accountRegion")}
        />
        <SelectField
          label="Vehicle type"
          placeholder="Select vehicle type"
          value={formData.accountInfo.vehicleType}
          onPress={() => openSelection("vehicleType")}
        />
        <Text style={styles.label}>Employment availability</Text>
        <View style={styles.pillRow}>
          {employmentOptions.map((option) => (
            <OptionPill
              key={option.value}
              label={option.label}
              selected={formData.accountInfo.employmentType === option.value}
              onPress={() =>
                updateField("accountInfo", "employmentType", option.value)
              }
            />
          ))}
        </View>
      </Section>

      <Section title="Personal information">
        <LabeledInput
          label="First name"
          value={formData.personalInfo.firstName}
          onChangeText={(text) =>
            updateField("personalInfo", "firstName", text)
          }
        />
        <LabeledInput
          label="Middle name"
          value={formData.personalInfo.middleName}
          onChangeText={(text) =>
            updateField("personalInfo", "middleName", text)
          }
        />
        <LabeledInput
          label="Last name"
          value={formData.personalInfo.lastName}
          onChangeText={(text) => updateField("personalInfo", "lastName", text)}
        />
        <LabeledInput
          label="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.personalInfo.email}
          onChangeText={(text) => updateField("personalInfo", "email", text)}
        />
        <LabeledInput
          label="Date of birth"
          placeholder="YYYY-MM-DD"
          value={formData.personalInfo.dateOfBirth}
          onChangeText={(text) =>
            updateField("personalInfo", "dateOfBirth", text)
          }
        />
        <Text style={styles.label}>Sex</Text>
        <View style={styles.pillRow}>
          {sexOptions.map((option) => (
            <OptionPill
              key={option.value}
              label={option.label}
              selected={formData.personalInfo.sex === option.value}
              onPress={() => updateField("personalInfo", "sex", option.value)}
            />
          ))}
        </View>

        <Text style={[styles.label, styles.addressHeading]}>
          Current address
        </Text>
        <SelectField
          label="Region"
          placeholder="Select region"
          value={personalAddress.region}
          onPress={() => openSelection("addressRegion")}
        />
        <SelectField
          label="Province"
          placeholder={
            personalAddress.region ? "Select province" : "Select region first"
          }
          value={personalAddress.province}
          disabled={!personalAddress.regionCode}
          onPress={() => openSelection("province")}
        />
        <SelectField
          label="Municipality / City"
          placeholder={
            personalAddress.province
              ? "Select municipality"
              : "Select province first"
          }
          value={personalAddress.municipality}
          disabled={!personalAddress.provinceCode}
          onPress={() => openSelection("municipality")}
        />
        <SelectField
          label="Barangay"
          placeholder={
            personalAddress.municipality
              ? "Select barangay"
              : "Select city first"
          }
          value={personalAddress.barangay}
          disabled={!personalAddress.municipalityCode}
          onPress={() => openSelection("barangay")}
        />
        <View style={styles.addressRow}>
          <View style={styles.addressColumn}>
            <LabeledInput
              label="ZIP code"
              value={personalAddress.zipCode}
              placeholder="Enter ZIP"
              keyboardType="number-pad"
              onChangeText={(text) => updateAddress({ zipCode: text })}
            />
          </View>
          <View style={styles.addressColumn}>
            <LabeledInput
              label="House number (optional)"
              placeholder="House / Unit"
              value={personalAddress.houseNumber}
              onChangeText={(text) => updateAddress({ houseNumber: text })}
            />
          </View>
        </View>
        <LabeledInput
          label="Street (optional)"
          placeholder="Street name"
          value={personalAddress.street}
          onChangeText={(text) => updateAddress({ street: text })}
        />

        <Text style={styles.label}>Profile photo</Text>
        <ProfilePhotoCard
          value={formData.personalInfo.profilePhoto}
          onCapture={() => captureImage("personalInfo", "profilePhoto")}
          onUpload={() => pickImage("personalInfo", "profilePhoto")}
        />
      </Section>

      <Section title="Driver's license">
        <LabeledInput
          label="License number"
          value={formData.driversLicense.dlNumber}
          onChangeText={(text) =>
            updateField("driversLicense", "dlNumber", text)
          }
        />
        <LabeledInput
          label="License expiry"
          placeholder="YYYY-MM-DD"
          value={formData.driversLicense.dlExpiry}
          onChangeText={(text) =>
            updateField("driversLicense", "dlExpiry", text)
          }
        />
        <AttachmentPicker
          label="License front"
          value={formData.driversLicense.frontImage}
          onPick={() => pickImage("driversLicense", "frontImage")}
        />
        <AttachmentPicker
          label="License back"
          value={formData.driversLicense.backImage}
          onPick={() => pickImage("driversLicense", "backImage")}
        />
      </Section>

      <Section title="Emergency contact">
        <LabeledInput
          label="Full name"
          value={formData.emergencyContact.name}
          onChangeText={(text) => updateField("emergencyContact", "name", text)}
        />
        <LabeledInput
          label="Relationship"
          value={formData.emergencyContact.relationship}
          onChangeText={(text) =>
            updateField("emergencyContact", "relationship", text)
          }
        />
        <LabeledInput
          label="Phone number"
          keyboardType="phone-pad"
          value={formData.emergencyContact.phoneNumber}
          onChangeText={(text) =>
            updateField("emergencyContact", "phoneNumber", text)
          }
        />
      </Section>

      <Section title="Vehicle information">
        <LabeledInput
          label="Make"
          value={formData.vehicleInfo.make}
          onChangeText={(text) => updateField("vehicleInfo", "make", text)}
        />
        <LabeledInput
          label="Model"
          value={formData.vehicleInfo.model}
          onChangeText={(text) => updateField("vehicleInfo", "model", text)}
        />
        <LabeledInput
          label="Year"
          keyboardType="numeric"
          value={formData.vehicleInfo.year}
          onChangeText={(text) => updateField("vehicleInfo", "year", text)}
        />
        <LabeledInput
          label="Color"
          value={formData.vehicleInfo.color}
          onChangeText={(text) => updateField("vehicleInfo", "color", text)}
        />
        <LabeledInput
          label="Plate number"
          autoCapitalize="characters"
          value={formData.vehicleInfo.plateNumber}
          onChangeText={(text) =>
            updateField("vehicleInfo", "plateNumber", text)
          }
        />
      </Section>

      <Section title="Vehicle documents">
        <LabeledInput
          label="Registration number"
          value={formData.vehicleDocuments.registrationNumber}
          onChangeText={(text) =>
            updateField("vehicleDocuments", "registrationNumber", text)
          }
        />
        <LabeledInput
          label="Registration expiry"
          placeholder="YYYY-MM-DD"
          value={formData.vehicleDocuments.registrationExpiry}
          onChangeText={(text) =>
            updateField("vehicleDocuments", "registrationExpiry", text)
          }
        />
        <AttachmentPicker
          label="OR/CR document"
          value={formData.vehicleDocuments.orCrImage}
          onPick={() => pickImage("vehicleDocuments", "orCrImage")}
        />
      </Section>

      <Section title="Vehicle photos">
        <AttachmentPicker
          label="Front photo"
          value={formData.vehiclePhotos.front}
          onPick={() => pickImage("vehiclePhotos", "front")}
        />
        <AttachmentPicker
          label="Rear photo"
          value={formData.vehiclePhotos.rear}
          onPick={() => pickImage("vehiclePhotos", "rear")}
        />
      </Section>

      <Section title="Vehicle ownership">
        <LabeledInput
          label="Owner name"
          value={formData.vehicleOwnership.ownerName}
          onChangeText={(text) =>
            updateField("vehicleOwnership", "ownerName", text)
          }
        />
        <Text style={styles.label}>Ownership type</Text>
        <View style={styles.pillRow}>
          {ownershipOptions.map((option) => (
            <OptionPill
              key={option.value}
              label={option.label}
              selected={
                formData.vehicleOwnership.ownershipType === option.value
              }
              onPress={() =>
                updateField("vehicleOwnership", "ownershipType", option.value)
              }
            />
          ))}
        </View>
        <AttachmentPicker
          label="Supporting document"
          value={formData.vehicleOwnership.supportingDoc}
          onPick={() => pickImage("vehicleOwnership", "supportingDoc")}
        />
      </Section>

      <Section title="Government IDs">
        <LabeledInput
          label="TIN number"
          keyboardType="number-pad"
          value={formData.governmentIds.tinNumber}
          onChangeText={(text) =>
            updateField("governmentIds", "tinNumber", text)
          }
        />
        <LabeledInput
          label="SSS number"
          keyboardType="number-pad"
          value={formData.governmentIds.sssNumber}
          onChangeText={(text) =>
            updateField("governmentIds", "sssNumber", text)
          }
        />
      </Section>

      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        disabled={submitting}
        onPress={handleSubmit}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit application</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Link href="/login" style={styles.loginLink}>
          Login
        </Link>
      </View>

      <SelectionModal
        visible={selectionVisible}
        loading={selectionLoading}
        title={
          selectionKind === "accountRegion"
            ? "Select account region"
            : selectionKind === "vehicleType"
              ? "Select vehicle type"
              : selectionKind === "addressRegion"
                ? "Select address region"
                : selectionKind === "province"
                  ? "Select province"
                  : selectionKind === "municipality"
                    ? "Select municipality"
                    : selectionKind === "barangay"
                      ? "Select barangay"
                      : "Select"
        }
        options={selectionOptions}
        onSelect={handleSelectOption}
        onClose={() => {
          setSelectionVisible(false);
          setSelectionKind(null);
          setSelectionLoading(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#0f172a",
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fafafa",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    color: "#4b5563",
  },
  addressHeading: {
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    backgroundColor: "#fff",
  },
  pillSelected: {
    backgroundColor: "#1E90FF",
    borderColor: "#1E90FF",
  },
  pillText: {
    color: "#475569",
    fontWeight: "500",
  },
  pillTextSelected: {
    color: "#fff",
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  attachmentInfo: {
    flex: 1,
    gap: 6,
  },
  attachmentPreview: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5f5",
  },
  attachmentPlaceholder: {
    color: "#9ca3af",
    fontSize: 13,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E90FF",
  },
  secondaryButtonText: {
    color: "#1E90FF",
    fontWeight: "600",
  },
  selectField: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  selectFieldDisabled: {
    opacity: 0.6,
  },
  selectFieldValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectFieldValue: {
    fontWeight: "600",
    color: "#111",
  },
  selectFieldPlaceholder: {
    color: "#9ca3af",
  },
  addressRow: {
    flexDirection: "row",
    gap: 12,
  },
  addressColumn: {
    flex: 1,
  },
  profilePhotoCard: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: "center",
    marginBottom: 12,
  },
  profilePhotoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  profilePhotoActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: "#16a34a",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  loginText: {
    color: "#475569",
    marginRight: 6,
  },
  loginLink: {
    color: "#1E90FF",
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalLoader: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalItemLabel: {
    fontSize: 16,
    color: "#111",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
});
