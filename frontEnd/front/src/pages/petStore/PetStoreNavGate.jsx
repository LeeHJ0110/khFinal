import { useEffect, useState } from "react";
import PetStoreGuestNav from "./PetStoreGuestNav";
import PetStoreUserNav from "./PetStoreUserNav";
import PetStoreAdminNav from "./PetStoreAdminNav";
import {
  getLoginMemberFromToken,
  isStoreAdmin,
  isStoreUser,
} from "../../shared/utils/authUtil";

export default function PetStoreNavGate({ targetPetType, activeCategory }) {
  const [loginMember, setLoginMember] = useState(() =>
    getLoginMemberFromToken(),
  );

  console.log("스토어 네브 loginMember:", loginMember);
  console.log("스토어 네브 role:", loginMember?.role);

  useEffect(() => {
    function handleAuthChange() {
      setLoginMember(getLoginMemberFromToken());
    }

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  if (isStoreAdmin(loginMember)) {
    return (
      <PetStoreAdminNav
        targetPetType={targetPetType}
        activeCategory={activeCategory}
      />
    );
  }

  if (isStoreUser(loginMember)) {
    return (
      <PetStoreUserNav
        targetPetType={targetPetType}
        activeCategory={activeCategory}
      />
    );
  }

  return (
    <PetStoreGuestNav
      targetPetType={targetPetType}
      activeCategory={activeCategory}
    />
  );
}
