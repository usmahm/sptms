import { useState } from "react";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import DropDown, { OptionType } from "../UI/DropDown/DropDown";
import useBusesStore, { BusType } from "@/store/useBusesStore";
import { useShallow } from "zustand/shallow";

const statusOptions = [
  { label: "Inactive", value: "INACTIVE" },
  { label: "Active", value: "ACTIVE" }
];

type CreateBusType = {
  onCancel: () => void;
  busData?: BusType;
  onCreateBus: () => void;
};

const CreateBus: React.FC<CreateBusType> = ({
  onCancel,
  busData,
  onCreateBus
}) => {
  const { createBus, creatingBus } = useBusesStore(
    useShallow((state) => ({
      creatingBus: state.creatingBus,
      createBus: state.createBus
    }))
  );

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<OptionType | null>(null);

  const onSubmitHandler = async () => {
    if (name && code && status) {
      const busData = {
        name,
        code,
        status: status.value
      };

      await createBus(busData, onCreateBus);
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
          loading={creatingBus}
        />
        <Button label="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};

export default CreateBus;
