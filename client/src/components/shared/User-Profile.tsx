import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/Button";
import { Activity, Badge, Camera, Edit, Form, Save, Shield, User, X, Lock, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { getInitials } from "@/utils/utils";



export default function UserProfile() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [profileForm, setprofileForm] = useState({
        
    });

  

  return (
    <div className="flex-1 space-y-2 bg-[#F9FAFB] dark:bg-slate-950 min-h-screen">
      {/* <FileLoadingDialog open={fileOperationInProgress} />
      <Header title="My Profile" /> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-3">
        {/* Profile Overview + Quick Stats */}
        <div className="lg:col-span-1 space-y-2">
          <Card className="!mt-0 overflow-hidden border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="relative h-28 bg-gradient-to-r from-[#7B2CBF] via-[#6D28D9] to-[#00C4B4]">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-3 z-10 text-white hover:bg-white/15"
                      onClick={() => {
                        setSelectedTab("overview");
                        setIsEditingProfile(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Edit profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardContent className="p-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="-mt-14 flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-28 w-28 border-4 border-white shadow-lg ring-2 ring-gray-100 dark:border-slate-900 dark:ring-slate-800">
                      <AvatarImage
                        loading="lazy"
                        src={
                          user?.user.userId?`/api/users/${user?.user.userId}/photo`
                          : undefined
                        }
                        alt={getInitials(user?.user?.firstName?? "", user?.user?.lastName??"")}
                      />
                      <AvatarFallback className="bg-sky-100 text-xl font-bold text-blue-800 dark:bg-sky-950 dark:text-blue-200">
                        {getInitials(user?.user?.firstName?? "", user?.user?.lastName??"")}
                      </AvatarFallback>
                    </Avatar>
                    {user?.user.userId && (
                      <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-white shadow-md transition hover:bg-zinc-800 dark:border-slate-900">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedFile(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {selectedFile && (
                  <div className="w-full space-y-2 p-3 border rounded-lg bg-muted/50">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-100 ring-2 ring-primary/20">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm font-medium">New Photo Preview</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedFile.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        // onClick={handlePhotoUpload}
                        // disabled={uploadPhotoMutation.isPending}
                        className="w-full sm:w-auto flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-200 bg-violet-700 text-white"
                      >
                        {/* {uploadPhotoMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Save className="h-3 w-3 mr-2" />
                            Save Photo
                          </>
                        )} */}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedFile(null)}
                        // disabled={uploadPhotoMutation.isPending}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* <div className="w-full space-y-2 text-center">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {getDisplayName()}
                    </h3>
                    {user.employee?.position && (
                      <p className="mt-0 text-sm text-slate-500 dark:text-slate-400">{user.employee.position}</p>
                    )}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                    <Badge
                      className={`${getRoleColor(selectedRole || "")} rounded-full px-3 py-1 text-xs font-semibold`}
                    >
                      {selectedRole?.replace("_", " ").toUpperCase() || ""}
                    </Badge>
                    {user.employee?.joinDate && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Joined {format(new Date(user.employee.joinDate), "MMM yyyy")}
                      </span>
                    )}
                  </div>
                </div> */}

                <div className="w-full space-y-3 border-t border-slate-200 pt-5 dark:border-slate-700">
                  <div className="flex items-start gap-3 text-left">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span className="text-sm leading-snug text-slate-600 dark:text-slate-300 break-all">{user?.user.email}</span>
                  </div>
                  {/* {user.employee?.phone && (
                    <div className="flex items-start gap-3 text-left">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{user.employee.phone}</span>
                    </div>
                  )}
                  {user.employee?.address && (
                    <div className="flex items-start gap-3 text-left">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span className="text-sm leading-snug text-slate-600 dark:text-slate-300">{user.employee.address}</span>
                    </div>
                  )} */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full mb-[25px]"
          >
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-slate-700 dark:bg-slate-800/90">
              <TabsTrigger
                value="overview"
                className="relative flex items-center justify-start gap-1.5 rounded-md border border-transparent bg-transparent px-2.5 py-1.5 text-xs font-medium text-slate-500 shadow-none transition-colors hover:text-slate-600 data-[state=active]:border-violet-200 data-[state=active]:bg-white data-[state=active]:text-violet-900 data-[state=active]:shadow-none dark:text-slate-400 dark:hover:text-slate-300 dark:data-[state=active]:border-violet-500 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-violet-100"
              >
                <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="relative flex items-center justify-start gap-1.5 rounded-md border border-transparent bg-transparent px-2.5 py-1.5 text-xs font-medium text-slate-500 shadow-none transition-colors hover:text-slate-600 data-[state=active]:border-violet-200 data-[state=active]:bg-white data-[state=active]:text-violet-900 data-[state=active]:shadow-none dark:text-slate-400 dark:hover:text-slate-300 dark:data-[state=active]:border-violet-500 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-violet-100"
              >
                <Activity className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="relative flex items-center justify-start gap-1.5 rounded-md border border-transparent bg-transparent px-2.5 py-1.5 text-xs font-medium text-slate-500 shadow-none transition-colors hover:text-slate-600 data-[state=active]:border-violet-200 data-[state=active]:bg-white data-[state=active]:text-violet-900 data-[state=active]:shadow-none dark:text-slate-400 dark:hover:text-slate-300 dark:data-[state=active]:border-violet-500 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-violet-100"
              >
                <Shield className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="overview" className="mt-3 space-y-2">
              <Card className="border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 pb-4 dark:border-slate-800">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile Information</CardTitle>
                  <TooltipProvider delayDuration={100}>
                    {isEditingProfile ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto gap-1.5 border-0 bg-transparent px-2 py-1 text-red-600 shadow-none hover:!bg-transparent hover:text-red-700 dark:text-red-500 dark:hover:!bg-transparent dark:hover:text-red-400"
                            onClick={() => setIsEditingProfile(false)}
                          >
                            <X className="h-4 w-4 shrink-0" />
                            Cancel
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Discard changes</TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto gap-1.5 border-0 bg-transparent px-2 py-1 text-blue-600 shadow-none hover:!bg-transparent hover:text-blue-700 dark:text-blue-400 dark:hover:!bg-transparent dark:hover:text-blue-300"
                            onClick={() => setIsEditingProfile(true)}
                          >
                            <Edit className="h-4 w-4 shrink-0" />
                            Edit
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Edit your profile</TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </CardHeader>
                <CardContent className="p-3">
                  {isEditingProfile ? (
                    <Form {...profileForm}>
                     
                    </Form>
                  ) : (
                    <div className="space-y-2">
                      {/* <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="min-w-0">
                          <label className="block text-xs text-slate-500 dark:text-slate-400">Full Name</label>
                          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {user.employee?.firstName} {user.employee?.middleName} {user.employee?.lastName}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <label className="block text-xs text-slate-500 dark:text-slate-400">Date of Birth</label>
                          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {user.employee?.dateOfBirth ? user.employee.dateOfBirth : "N/A"}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <label className="block text-xs text-slate-500 dark:text-slate-400">Marital Status</label>
                          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {user.employee?.maritalStatus
                              ? user.employee.maritalStatus.charAt(0).toUpperCase() + user.employee.maritalStatus.slice(1)
                              : "N/A"}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <label className="block text-xs text-slate-500 dark:text-slate-400">Email Address</label>
                          <p className="mt-1 break-all text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {user.employee?.email}
                          </p>
                        </div>
                        {user.employee?.emergencyContactName && (
                          <div className="min-w-0 md:col-span-2">
                            <label className="block text-xs text-slate-500 dark:text-slate-400">Emergency Contact</label>
                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {user.employee.emergencyContactName}
                            </p>
                          </div>
                        )}
                        {user.employee?.phone && (
                          <div className="min-w-0">
                            <label className="block text-xs text-slate-500 dark:text-slate-400">Phone Number</label>
                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {user.employee.phone}
                            </p>
                          </div>
                        )}
                        {user.employee?.emergencyContactPhone && (
                          <div className="min-w-0">
                            <label className="block text-xs text-slate-500 dark:text-slate-400">Emergency Phone</label>
                            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {user.employee.emergencyContactPhone}
                            </p>
                          </div>
                        )}
                        <div className="min-w-0 md:col-span-2 pb-3">
                          <label className="block text-xs text-slate-500 dark:text-slate-400">Address</label>
                          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {user.employee?.address || "N/A"}
                          </p>
                        </div>
                      </div>

                      {user.employee && (
                        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                          <h4 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Work Information</h4>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div className="rounded-lg border border-blue-100 border-l-2 border-l-blue-500 bg-sky-50/90 py-3 pl-3 pr-3 dark:border-blue-900 dark:bg-sky-950/30 dark:border-l-blue-400">
                              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
                                Employee ID
                              </label>
                              <p className="font-base text-base font-bold text-slate-900 dark:text-slate-100">
                                {user.employee.employeeId}
                              </p>
                            </div>
                            <div className="rounded-lg border border-blue-100 border-l-2 border-l-blue-500 bg-sky-50/90 py-3 pl-3 pr-3 dark:border-blue-900 dark:bg-sky-950/30 dark:border-l-blue-400">
                              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
                                Position
                              </label>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                {user.employee.position || "Not specified"}
                              </p>
                            </div>
                            <div className="rounded-lg border border-green-100 border-l-2 border-l-green-500 bg-green-50/90 py-3 pl-3 pr-3 dark:border-green-900 dark:bg-green-950/30 dark:border-l-green-400">
                              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-300">
                                Department
                              </label>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                {user.employee.department || "Not specified"}
                              </p>
                            </div>
                            {user.employee.joinDate && (
                              <div className="rounded-lg border border-purple-100 border-l-2 border-l-purple-500 bg-purple-50/90 py-3 pl-3 pr-3 dark:border-purple-900 dark:bg-purple-950/30 dark:border-l-purple-400">
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-purple-700 dark:text-purple-300">
                                  Join Date
                                </label>
                                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                  {user.employee.joinDate ?? "N/A"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )} */}
                    </div>
                 )}
                </CardContent>
              </Card>

            </TabsContent>

            <TabsContent value="activity" className="mt-3 space-y-2">
              {/* <Card className="border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="border-b border-gray-100 dark:border-slate-800">
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h1>
                  <p className="!-mt-0 text-sm text-muted-foreground">
                    A timeline of your recent actions and events.
                  </p>
                </CardHeader>
                <CardContent className="pt-3">
                  {leavesLoading || documentsLoading ? (
                    <div className="flex flex-col items-center justify-center py-14">
                      <div className="h-9 w-9 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                      <p className="mt-4 text-sm text-muted-foreground">Loading activity…</p>
                    </div>
                  ) : activityTimelineItems.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                      No recent activity to show yet.
                    </p>
                  ) : (
                    <div className="relative space-y-0 pl-1">
                      <div className="absolute bottom-4 left-[18px] top-4 w-px bg-gray-200 dark:bg-slate-700" aria-hidden />
                      <div className="space-y-8">
                        {activityTimelineItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.id} className="relative flex gap-4">
                              <div
                                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm ${item.ringClass}`}
                              >
                                <Icon className={`h-4 w-4 ${item.iconClass}`} />
                              </div>
                              <div className="min-w-0 flex-1 pt-0.5">
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                  {item.description}
                                </p>
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                  <Clock className="h-3.5 w-3.5 shrink-0" />
                                  {formatActivityTimestamp(item.at)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card> */}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-2 mt-3">
              
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-3 space-y-2">
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                <Card className="!mt-0 border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CardHeader className="border-b border-gray-100 pb-4 dark:border-slate-800">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-3 dark:border-slate-800">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Account Role</span>
                      {/* <Badge className={`${getRoleColor(selectedRole || "")} rounded-full px-3 py-1 text-xs font-semibold uppercase`}>
                        {selectedRole?.replace("_", " ") || ""}
                      </Badge> */}
                    </div>
                    <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-3 dark:border-slate-800">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Account Status</span>
                      <Badge className="rounded-full border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                        Active
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Last Login</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Not available</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="!mt-0 border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CardHeader className="border-b border-gray-100 pb-4 dark:border-slate-800">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      <Lock className="h-5 w-5 text-blue-600" />
                      Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-3">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      Ensure your account is using a long, random password to stay secure.
                    </p>
                    <p className="text-sm text-muted-foreground">Last changed: Not available</p>
                    {/* <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full border-gray-300 bg-white font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                    >
                      Change Password
                    </Button>

                    {isChangingPassword && (
                      <Card className="border border-blue-100 bg-slate-50/80 dark:border-blue-900 dark:bg-slate-950">
                        <CardContent className="p-3">
                          <Form {...passwordForm}>
                            <form
                              onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                              className="space-y-2"
                            >
                              <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                      Current Password
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="password"
                                        className="h-9 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                      New Password
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="password"
                                        className="h-9 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                      Confirm New Password
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="password"
                                        className="h-9 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row">
                                <Button
                                  type="submit"
                                  disabled={changePasswordMutation.isPending}
                                  className="h-9 flex-1 bg-blue-600 font-semibold text-white hover:bg-blue-700 sm:flex-initial sm:px-8"
                                >
                                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsChangingPassword(false)}
                                  className="h-9 border-slate-300 px-6 font-medium dark:border-slate-600"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    )} */}
                  </CardContent>
                </Card>
              </div>

              {/* <Card className="border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="border-b border-gray-100 pb-4 dark:border-slate-800">
                  <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Two-Factor Authentication
                  </h1>
                  <p className="!-mt-0 text-sm text-muted-foreground">
                    Add additional security to your account using two-factor authentication.
                  </p>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/50">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 space-y-1">
                        <p className="font-medium text-slate-900 dark:text-slate-100">Authenticator App</p>
                        <p className="text-sm text-muted-foreground">
                          Use an app like Google Authenticator to get 2FA codes.
                        </p>
                      </div>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} aria-label="Toggle authenticator app 2FA" />
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* <Card className="border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardHeader className="border-b border-gray-100 pb-4 dark:border-slate-800">
                  <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">Active Sessions</h1>
                  <p className="!-mt-0 text-sm text-muted-foreground">
                    Review and manage your active sessions across devices.
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 p-3">
                  <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50/80 p-3 dark:border-blue-900 dark:bg-blue-950/40">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100">This browser</span>
                        <Badge className="rounded-full bg-blue-600 px-2 py-0 text-[10px] font-semibold uppercase text-white">
                          Current
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        You are signed in on this device.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
