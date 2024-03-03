"use client";

import { Button } from "@restauwants/ui/button";
import { Input } from "@restauwants/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@restauwants/ui/modal";

export function AddContact() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          Manage Friends
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Friends</DialogTitle>
        </DialogHeader>
        <h4 className="font-medium">Add a Friend</h4>
        <Input id="username" placeholder="Enter the username of your friend" />
        <DialogFooter>
          <Button type="submit">Send Request</Button>
        </DialogFooter>
        <h4 className="font-medium">Received Friend Requests</h4>
        <div className="flex flex-col gap-4 divide-y-2 [&>*:first-child]:pt-0 [&>div]:pt-4">
          <div className="flex flex-row justify-between">
            <p>John Doe</p>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Accept
              </Button>
              <Button variant="outline" size="sm">
                Reject
              </Button>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <p>Jane Doe</p>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Accept
              </Button>
              <Button variant="outline" size="sm">
                Reject
              </Button>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <p>John Smith</p>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Accept
              </Button>
              <Button variant="outline" size="sm">
                Reject
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
