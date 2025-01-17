import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDebounce from "react-use/esm/useDebounce"

import { Avatar } from "./catalyst/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./catalyst/dropdown";
import { Heading } from "./catalyst/heading";
import { Input, InputGroup } from "./catalyst/input";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "./catalyst/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  SidebarSpacer,
} from "./catalyst/sidebar";
import { SidebarLayout } from "./catalyst/sidebar-layout";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Text } from "./catalyst/text";
import { CafeList } from "./cafe-list";
import { Button } from "./catalyst/button";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from "./catalyst/dialog";
import { Field, Label } from "./catalyst/fieldset";
import { createClient } from "@supabase/supabase-js";
import { LanguageSwitcher } from "./language-switcher";
import { SearchFilters } from "./search-filters";
import { useStore } from "../store";
import { useCafes } from "../hooks/use-cafes";
import { useMapCafes } from "../hooks/use-map-cafes";
import { BadgeButton } from "./catalyst/badge";
import { useRouter } from "@tanstack/react-router";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);


export function MainSidebar({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("cafes");
  const { mapCenter, setMapCenter } = useStore();
  const router = useRouter();
  const { loggedInUser } = router.options.context as any;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { data: searchCafes, isLoading: isSearchLoading, error: searchError } = useCafes(mapCenter.lat, mapCenter.long, debouncedSearchTerm);
  const { data: mapCafesData, isLoading: isMapCafesLoading, error: mapCafesError } = useMapCafes(mapCenter.lat, mapCenter.long);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchInput);
    },
    300,
    [searchInput]
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location:", error)
    );
  }, [setMapCenter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };


  return (
    <>
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <NavbarItem href="/search" aria-label={t("search")}>
                <MagnifyingGlassIcon />
              </NavbarItem>
              <Dropdown>
                <DropdownButton as={NavbarItem}>
                  <Avatar src="/profile-photo.jpg" square />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="bottom end">
                  <DropdownItem href="/my-profile">
                    <UserIcon />
                    <DropdownLabel>My profile</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem href="/settings">
                    <Cog8ToothIcon />
                    <DropdownLabel>Settings</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="/privacy-policy">
                    <ShieldCheckIcon />
                    <DropdownLabel>Privacy policy</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem href="/share-feedback">
                    <LightBulbIcon />
                    <DropdownLabel>Share feedback</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="/logout">
                    <ArrowRightStartOnRectangleIcon />
                    <DropdownLabel>Sign out</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-4">
                      <Heading>KopiMap</Heading>
                      <LanguageSwitcher />
                      <BadgeButton target="_blank" href="https://www.instagram.com/kopimap/">
                      <img src="/instagram.svg" alt="Instagram"  />
                      </BadgeButton>
                    </div>
                    <Text>{t("appDescription")}</Text>
                  </div>
                </div>
                <Navbar>
                  <NavbarSection className="">
                    <NavbarItem
                      current={selectedTab === "cafes"}
                      onClick={() => {
                        setSelectedTab("cafes");
                      }}
                    >
                      Cafes
                    </NavbarItem>
                    <NavbarItem 
                      current={selectedTab === "filters"}
                      onClick={() => {
                        setSelectedTab("filters");
                      }}
                    >
                      Filters
                    </NavbarItem>
                  </NavbarSection>
                </Navbar>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="grow">
                  <InputGroup className="">
                    <MagnifyingGlassIcon />
                    <Input
                      name="search"
                      placeholder={t("searchCafes")}
                      aria-label={t("search")}
                      onChange={handleSearch}
                      value={searchInput}
                    />
                  </InputGroup>
                </div>
              </div>
            </SidebarHeader>
            <SidebarBody>
              <SidebarSection className="max-lg:hidden">
              {selectedTab === "cafes" && (
                  <>
                    {(isSearchLoading || isMapCafesLoading) && <Text>{t("loading")}</Text>}
                    {(searchError || mapCafesError) && <Text color="red">{JSON.stringify(searchError || mapCafesError)}</Text>}
                    <CafeList 
  searchInput={searchInput} 
  mapCafes={mapCafesData} 
  searchCafes={searchCafes} 
/>
                  </>
                )}
                {selectedTab === "filters" && (
                  <>
                    <SearchFilters />
                  </>
                )}
              </SidebarSection>
              <SidebarSpacer />
            </SidebarBody>
            <SidebarFooter className="max-lg:hidden">
              <Dropdown>
                <DropdownButton as={SidebarItem}>
                  <div className="flex items-baseline justify-between w-full">
                    {loggedInUser && (
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar
                          src={loggedInUser.user_metadata.avatar_url}
                          className="size-10"
                          square
                          alt=""
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                            {loggedInUser.user_metadata.name}
                          </span>
                          <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                            {loggedInUser.email}
                          </span>
                        </span>
                      </span>
                    )}
                    {!loggedInUser && (
                      <Text className="flex min-w-0 items-center gap-3">
                        {t("loginToReview")}
                      </Text>
                    )}
                  </div>

                  <ChevronUpIcon />
                </DropdownButton>
                {/* <div className="px-2">
                  <Link
                    href="https://github.com/eg9y"
                    target="_blank"
                    className="text-xs"
                  >
                    other apps{" "}
                  </Link>
                </div> */}
                <DropdownMenu className="min-w-64" anchor="top start">
                  {loggedInUser && (
                    <>
                      {/* <DropdownItem href="/my-profile">
                        <UserIcon />
                        <DropdownLabel>My profile</DropdownLabel>
                      </DropdownItem>
                      <DropdownItem href="/share-feedback">
                        <LightBulbIcon />
                        <DropdownLabel>Share feedback</DropdownLabel>
                      </DropdownItem>
                      <DropdownDivider /> */}
                      <DropdownItem
                        onClick={async () => {
                          await supabase.auth.signOut();
                          window.location.reload();
                        }}
                      >
                        <ArrowRightStartOnRectangleIcon />
                        <DropdownLabel>{t("signOut")}</DropdownLabel>
                      </DropdownItem>
                    </>
                  )}
                  {!loggedInUser && (
                    <>
                      {/* <DropdownDivider /> */}
                      <DropdownItem
                        onClick={async () => {
                          await supabase.auth.signInWithOAuth({
                            provider: "google",
                            options: {
                              redirectTo: import.meta.env.VITE_URL,
                            },
                          });
                        }}
                      >
                        <ArrowRightStartOnRectangleIcon />
                        <DropdownLabel>{t("signIn")}</DropdownLabel>
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
            </SidebarFooter>
          </Sidebar>
        }
      >
         {children}
      </SidebarLayout>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>{t("searchFilters")}</DialogTitle>
        <DialogDescription>{t("searchFiltersDescription")}</DialogDescription>
        <DialogBody>
          <Field>
            <Label>Distance</Label>
            <Input name="amount" placeholder="$0.00" />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Search</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
