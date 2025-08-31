import { useState } from "react";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import DropDown, { OptionType } from "../UI/DropDown/DropDown";
import api, { ApiResponse } from "@/api/api";
import { toast } from "react-toastify";
import { LAT_LNG_TYPE } from "@/types";

const statusOptions = [
  { label: "Inactive", value: "INACTIVE" },
  { label: "Active", value: "ACTIVE" }
];

export type BusType = {
  id: string;
  name: string;
  code: string;
  status: string;
  location?: LAT_LNG_TYPE;
  // capacity: number;
};

type CreateBusType = {
  onCancel: () => void;
  busData?: BusType;
  onCreateBus: (newBus: BusType) => void;
};

const CreateBus: React.FC<CreateBusType> = ({
  onCancel,
  busData,
  onCreateBus
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<OptionType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmitHandler = async () => {
    try {
      setSubmitting(true);

      if (name && code && status) {
        const busData = {
          name,
          code,
          status: status.value
        };

        const response: ApiResponse<BusType[]> = await api.post(
          "/bus-nodes",
          busData
        );
        if (response.success) {
          toast.success("Bus Created Successfully!");
          onCreateBus(response.data[0]);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      toast.error("Unable to create new bus!");
    } finally {
      setSubmitting(false);
    }
  };

  let done = false;
  if (name && code && status) done = true;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-xl font-semibold mb-4">Add New Bus</p>

      <div className="flex flex-col-reverse">
        <div>
          <div className="flex gap-4">
            <Input
              id="name"
              label="Bus Name"
              value={name}
              onChange={(v) => setName(v)}
            />
            <Input
              id="code"
              label="Bus Code"
              value={code}
              onChange={(v) => {
                setCode(v);
              }}
            />
          </div>
          <div className="flex gap-2 mt-4 w-[50%]">
            <DropDown
              label="Bus Status"
              value={status ? status.label : ""}
              placeholder="Select Status"
              options={statusOptions}
              onClick={(v) => setStatus(v)}
            />
            <div />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          label="Create Bus"
          onClick={onSubmitHandler}
          disabled={!done}
          loading={submitting}
        />
        <Button label="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};

export default CreateBus;
