"use client"
import { useEffect, useMemo, useReducer } from "react"

// ── Types ──────────────────────────────────────────────────────────────────────

interface Division       { id: string; name_bn: string; name_en: string }
interface District       { id: string; name_bn: string; name_en: string; division_id: string }
interface Thana          { id: string; name_bn: string; name_en: string; district_id: string }
interface Union          { id: string; name_bn: string; name_en: string; thana_id: string }
interface PostOffice     { id: string; name_bn: string; name_en: string; code: string; district_id: string }
interface Municipality   { id: string; name_bn: string; name_en: string; district_id: string }
interface CityCorporation{ id: string; name_bn: string; name_en: string; district_id: string }

interface AddressData {
  addressTypes:      { value: string; label_bn: string; label_en: string }[]
  divisions:         Division[]
  districts:         District[]
  thanas:            Thana[]
  unions:            Union[]
  postOffices:       PostOffice[]
  municipalities:    Municipality[]
  cityCorporations:  CityCorporation[]
}

export interface BangladeshLocation {
  addressType:       string
  division:          string
  divisionName:      string
  district:          string
  districtName:      string
  thana:             string
  thanaName:         string
  union:             string
  municipality:      string
  cityCorporation:   string
  postOffice:        string
  postOfficeCode:    string
  ward:              string
  ownershipType:     string
}

interface State {
  data:              AddressData | null
  loading:           boolean
  addressType:       string
  divisionId:        string
  districtId:        string
  thanaId:           string
  unionId:           string
  municipalityId:    string
  cityCorporationId: string
  postOfficeId:      string
  ward:              string
  ownershipType:     string
}

type Action =
  | { type: "SET_DATA"; payload: AddressData }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ADDRESS_TYPE"; payload: string }
  | { type: "SET_DIVISION"; payload: string }
  | { type: "SET_DISTRICT"; payload: string }
  | { type: "SET_THANA"; payload: string }
  | { type: "SET_UNION"; payload: string }
  | { type: "SET_MUNICIPALITY"; payload: string }
  | { type: "SET_CITY_CORPORATION"; payload: string }
  | { type: "SET_POST_OFFICE"; payload: string }
  | { type: "SET_WARD"; payload: string }
  | { type: "SET_OWNERSHIP"; payload: string }

const INITIAL: State = {
  data: null, loading: true,
  addressType: "Union", divisionId: "", districtId: "", thanaId: "",
  unionId: "", municipalityId: "", cityCorporationId: "",
  postOfficeId: "", ward: "", ownershipType: "",
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_DATA":    return { ...state, data: action.payload, loading: false }
    case "SET_LOADING": return { ...state, loading: action.payload }
    case "SET_ADDRESS_TYPE":
      return { ...state, addressType: action.payload,
        districtId: "", thanaId: "", unionId: "", municipalityId: "",
        cityCorporationId: "", postOfficeId: "", ward: "" }
    case "SET_DIVISION":
      return { ...state, divisionId: action.payload,
        districtId: "", thanaId: "", unionId: "", municipalityId: "",
        cityCorporationId: "", postOfficeId: "" }
    case "SET_DISTRICT":
      return { ...state, districtId: action.payload,
        thanaId: "", unionId: "", municipalityId: "",
        cityCorporationId: "", postOfficeId: "" }
    case "SET_THANA":
      return { ...state, thanaId: action.payload, unionId: "" }
    case "SET_UNION":           return { ...state, unionId: action.payload }
    case "SET_MUNICIPALITY":    return { ...state, municipalityId: action.payload }
    case "SET_CITY_CORPORATION":return { ...state, cityCorporationId: action.payload }
    case "SET_POST_OFFICE":     return { ...state, postOfficeId: action.payload }
    case "SET_WARD":            return { ...state, ward: action.payload }
    case "SET_OWNERSHIP":       return { ...state, ownershipType: action.payload }
    default: return state
  }
}

// ── Ward options (static 1–99) ─────────────────────────────────────────────────
const WARD_OPTIONS = Array.from({ length: 99 }, (_, i) => ({
  value: String(i + 1),
  label: `${toBengaliDigits(i + 1)} নং (${i + 1})`,
}))

function toBengaliDigits(n: number): string {
  const bn = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"]
  return String(n).split("").map(d => bn[parseInt(d)] ?? d).join("")
}

const OWNERSHIP_OPTIONS = [
  { value: "House Owner", label: "বাড়ির মালিক (House Owner)" },
  { value: "Tenant",      label: "ভাড়াটিয়া (Tenant)" },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

const selectClass =
  "w-full px-3 py-2.5 text-sm border border-[#E5E5E5] rounded-sm focus:outline-none focus:border-[#111111] bg-white disabled:bg-[#F5F5F5] disabled:text-[#999] cursor-pointer"

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[#111111] mb-1">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

interface SelectFieldProps {
  label:      string
  required?:  boolean
  value:      string
  onChange:   (v: string) => void
  disabled?:  boolean
  placeholder:string
  options:    { value: string; label: string }[]
}

function SelectField({ label, required, value, onChange, disabled, placeholder, options }: SelectFieldProps) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select
        className={selectClass}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled || options.length === 0}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  onChange: (loc: BangladeshLocation) => void
}

export function BangladeshLocationSelector({ onChange }: Props) {
  const [s, dispatch] = useReducer(reducer, INITIAL)

  // Load JSON once
  useEffect(() => {
    fetch("/data/bangladesh_address_data.json")
      .then(r => r.json())
      .then((d: AddressData) => dispatch({ type: "SET_DATA", payload: d }))
      .catch(() => dispatch({ type: "SET_LOADING", payload: false }))
  }, [])

  // Derived filtered lists
  const districts        = useMemo(() => s.data?.districts.filter(d => d.division_id === s.divisionId) ?? [], [s.data, s.divisionId])
  const thanas           = useMemo(() => s.data?.thanas.filter(t => t.district_id === s.districtId) ?? [], [s.data, s.districtId])
  const postOffices      = useMemo(() => s.data?.postOffices.filter(p => p.district_id === s.districtId) ?? [], [s.data, s.districtId])
  const unions           = useMemo(() => s.data?.unions.filter(u => u.thana_id === s.thanaId) ?? [], [s.data, s.thanaId])
  const municipalities   = useMemo(() => s.data?.municipalities.filter(m => m.district_id === s.districtId) ?? [], [s.data, s.districtId])
  const cityCorporations = useMemo(() => s.data?.cityCorporations.filter(c => c.district_id === s.districtId) ?? [], [s.data, s.districtId])

  // Notify parent whenever key values change
  useEffect(() => {
    const division  = s.data?.divisions.find(d => d.id === s.divisionId)
    const district  = s.data?.districts.find(d => d.id === s.districtId)
    const thana     = s.data?.thanas.find(t => t.id === s.thanaId)
    const po        = s.data?.postOffices.find(p => p.id === s.postOfficeId)
    onChange({
      addressType:        s.addressType,
      division:           s.divisionId,
      divisionName:       division?.name_en ?? "",
      district:           s.districtId,
      districtName:       district?.name_en ?? "",
      thana:              s.thanaId,
      thanaName:          thana?.name_en ?? "",
      union:              s.unionId,
      municipality:       s.municipalityId,
      cityCorporation:    s.cityCorporationId,
      postOffice:         s.postOfficeId,
      postOfficeCode:     po?.code ?? "",
      ward:               s.ward,
      ownershipType:      s.ownershipType,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.addressType, s.divisionId, s.districtId, s.thanaId, s.unionId,
      s.municipalityId, s.cityCorporationId, s.postOfficeId, s.ward, s.ownershipType])

  if (s.loading) {
    return <p className="text-xs text-[#999] py-2">Loading location data…</p>
  }
  if (!s.data) {
    return <p className="text-xs text-red-500 py-2">Failed to load location data.</p>
  }

  const isCityCorpType = s.addressType === "City Corporation"
  const isUnionType    = s.addressType === "Union"
  const isMuniType     = s.addressType === "Municipality"

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1 h-px bg-[#E5E5E5]" />
        <span className="text-[10px] font-bold tracking-widest text-[#999] uppercase">বাংলাদেশ ঠিকানা</span>
        <div className="flex-1 h-px bg-[#E5E5E5]" />
      </div>

      {/* Row: Address type + Division */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="ঠিকানার ধরন (Address Type)"
          required
          value={s.addressType}
          onChange={v => dispatch({ type: "SET_ADDRESS_TYPE", payload: v })}
          placeholder="ধরন নির্বাচন করুন"
          options={s.data.addressTypes.map(a => ({
            value: a.value,
            label: `${a.label_bn} (${a.label_en})`,
          }))}
        />
        <SelectField
          label="বিভাগ (Division)"
          required
          value={s.divisionId}
          onChange={v => dispatch({ type: "SET_DIVISION", payload: v })}
          placeholder="বিভাগ নির্বাচন করুন"
          options={s.data.divisions.map(d => ({
            value: d.id,
            label: `${d.name_bn} (${d.name_en})`,
          }))}
        />
      </div>

      {/* Row: District + Upazila (or merged Thana/Upazila for City Corp) */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="জেলা (District)"
          required
          value={s.districtId}
          onChange={v => dispatch({ type: "SET_DISTRICT", payload: v })}
          disabled={!s.divisionId}
          placeholder="জেলা নির্বাচন করুন"
          options={districts.map(d => ({ value: d.id, label: `${d.name_bn} (${d.name_en})` }))}
        />
        <SelectField
          label={isCityCorpType ? "থানা / উপজেলা (Thana/Upazila)" : "উপজেলা (Upazila)"}
          required
          value={s.thanaId}
          onChange={v => dispatch({ type: "SET_THANA", payload: v })}
          disabled={!s.districtId}
          placeholder="উপজেলা নির্বাচন করুন"
          options={thanas.map(t => ({ value: t.id, label: `${t.name_bn} (${t.name_en})` }))}
        />
      </div>

      {/* Row: Thana (hidden for City Corp) + Post Office */}
      {!isCityCorpType && (
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="থানা (Thana)"
            value={s.thanaId}
            onChange={v => dispatch({ type: "SET_THANA", payload: v })}
            disabled={!s.districtId}
            placeholder="থানা নির্বাচন করুন"
            options={thanas.map(t => ({ value: t.id, label: `${t.name_bn} (${t.name_en})` }))}
          />
          <SelectField
            label="ডাকঘর (Post Office)"
            required
            value={s.postOfficeId}
            onChange={v => dispatch({ type: "SET_POST_OFFICE", payload: v })}
            disabled={!s.districtId}
            placeholder="ডাকঘর নির্বাচন করুন"
            options={postOffices.map(p => ({
              value: p.id,
              label: `${p.name_bn} (${toBengaliDigits(parseInt(p.code))}) ${p.name_en} (${p.code})`,
            }))}
          />
        </div>
      )}

      {/* City Corp: Post Office row */}
      {isCityCorpType && (
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="ডাকঘর (Post Office)"
            required
            value={s.postOfficeId}
            onChange={v => dispatch({ type: "SET_POST_OFFICE", payload: v })}
            disabled={!s.districtId}
            placeholder="ডাকঘর নির্বাচন করুন"
            options={postOffices.map(p => ({
              value: p.id,
              label: `${p.name_bn} (${toBengaliDigits(parseInt(p.code))}) ${p.name_en} (${p.code})`,
            }))}
          />
          <SelectField
            label="সিটি কর্পোরেশন (City Corporation)"
            required
            value={s.cityCorporationId}
            onChange={v => dispatch({ type: "SET_CITY_CORPORATION", payload: v })}
            disabled={!s.districtId}
            placeholder="সিটি কর্পোরেশন নির্বাচন করুন"
            options={cityCorporations.map(c => ({ value: c.id, label: `${c.name_bn} (${c.name_en})` }))}
          />
        </div>
      )}

      {/* Row: Union / Municipality / (hidden for City Corp) + Ward */}
      <div className="grid grid-cols-2 gap-4">
        {isUnionType && (
          <SelectField
            label="ইউনিয়ন (Union)"
            required
            value={s.unionId}
            onChange={v => dispatch({ type: "SET_UNION", payload: v })}
            disabled={!s.thanaId}
            placeholder="ইউনিয়ন নির্বাচন করুন"
            options={unions.map(u => ({ value: u.id, label: `${u.name_bn} (${u.name_en})` }))}
          />
        )}
        {isMuniType && (
          <SelectField
            label="পৌরসভা (Municipality)"
            required
            value={s.municipalityId}
            onChange={v => dispatch({ type: "SET_MUNICIPALITY", payload: v })}
            disabled={!s.districtId}
            placeholder="পৌরসভা নির্বাচন করুন"
            options={municipalities.map(m => ({ value: m.id, label: `${m.name_bn} (${m.name_en})` }))}
          />
        )}
        {isCityCorpType && <div />}
        <SelectField
          label="ওয়ার্ড নং (Ward No.)"
          required
          value={s.ward}
          onChange={v => dispatch({ type: "SET_WARD", payload: v })}
          placeholder="ওয়ার্ড নির্বাচন করুন"
          options={WARD_OPTIONS}
        />
      </div>

      {/* Ownership type */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="মালিকানার ধরন (Ownership)"
          required
          value={s.ownershipType}
          onChange={v => dispatch({ type: "SET_OWNERSHIP", payload: v })}
          placeholder="মালিকানার ধরন নির্বাচন করুন"
          options={OWNERSHIP_OPTIONS}
        />
      </div>
    </div>
  )
}
