import Input from "@/components/UI/Input/Input";
import Button from "@/components/UI/Button/Button";
import DropDown, { OptionType } from "../UI/DropDown/DropDown";
import MapComponent, { ACTION_TYPES } from "../MapComponent/MapComponent";
import { useCallback, useEffect, useState } from "react";
import { LAT_LNG_TYPE } from "@/types";
import { MARKER_PROP_TYPE } from "../CustomMarker/CustomMarker";
import api, { ApiResponse } from "@/api/api";
import { toast } from "react-toastify";

// Make this user location
const center = {
  lat: 7.501217,
  lng: 4.502154
};

export type BusStopType = {
  name: string;
  code: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  id: string;
};

const statusOptions = [
  { label: "Inactive", value: "INACTIVE" },
  { label: "Active", value: "ACTIVE" }
];

type CreateBusStopType = {
  onCancel: () => void;
  busStopData?: BusStopType;
  onCreateBusStop: (newBusStop: BusStopType) => void;
};

const CreateBusStop: React.FC<CreateBusStopType> = ({
  onCancel,
  onCreateBusStop,
  busStopData
}) => {
  const [newBusStopCoords, setNewBusStopCoords] = useState<LAT_LNG_TYPE | null>(
    null
  );
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<OptionType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (busStopData) {
      setName(busStopData.name);
      setCode(busStopData.code);
      setNewBusStopCoords(busStopData.location);
      setStatus(
        statusOptions.find((o) => o.value === busStopData.status) || null
      );
    }
  }, []);

  // To handle selected coords on the map
  const onSelectCoord = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const latLng = e.latLng.toJSON();

    setNewBusStopCoords(latLng);
  };

  let markers: MARKER_PROP_TYPE[] = [];
  if (newBusStopCoords) {
    markers = [
      {
        label: name || "New Bus Stop",
        position: newBusStopCoords,
        draggable: true,
        onDragEnd: (e) => onSelectCoord(e)
      }
    ];
  }

  const onSubmitHandler = async () => {
    try {
      setSubmitting(true);

      if (name && code && status && newBusStopCoords) {
        const busStopData = {
          name,
          code,
          status: status.value,
          location: newBusStopCoords
        };

        const response: ApiResponse<BusStopType[]> = await api.post(
          "/bus-stops",
          busStopData
        );
        if (response.success) {
          toast.success("Bus Stop Created Successfully!");
          onCreateBusStop(response.data[0]);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      toast.error("Unable to create new bus stop!");
    } finally {
      setSubmitting(false);
    }
  };

  let done = false;
  if (name && code && status && newBusStopCoords) done = true;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-xl font-semibold mb-4">Add New Bus Stop</p>

      <div className="flex flex-col-reverse">
        <div className="h-80 border border-gray-200 rounded-lg mt-4 relative">
          <MapComponent
            center={center}
            actionMode={ACTION_TYPES.SELECT_POINT}
            markers={markers}
            onSelectPoint={onSelectCoord}
          />
        </div>

        <div>
          <div className="flex gap-4">
            <Input
              id="name"
              label="Name"
              value={name}
              onChange={(v) => setName(v)}
            />
            <Input
              id="code"
              label="Code"
              value={code}
              onChange={(v) => {
                setCode(v);
              }}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Input
              id="lat"
              label="Latitude"
              disabled
              onChange={() => {}}
              value={newBusStopCoords?.lat || ""}
              placeholder="Select location on map"
            />
            <Input
              id="lng"
              label="Longitude"
              disabled
              onChange={() => {}}
              value={newBusStopCoords?.lng || ""}
              placeholder="Select location on map"
            />
            <DropDown
              label="Status"
              value={status ? status.label : ""}
              placeholder="Select Status"
              options={statusOptions}
              onClick={(v) => setStatus(v)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          label="Create Bus Stop"
          onClick={onSubmitHandler}
          disabled={!done}
          loading={submitting}
        />
        <Button label="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};

export default CreateBusStop;
