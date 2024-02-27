"use client";

import React from "react";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "/Users/devin/uvic/StartupProgramming/restauwants/packages/ui/src/dialog"

  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    useForm,
  } from "@restauwants/ui/form";

import { api } from "~/trpc/react";

export function CollectionList() {
    return (
        
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 justify-items-center items-center">
        <CollectionCard name={"Vietnamese"} numRes={5}/>
        <CollectionCard name={"Top Bussin"} numRes={100}/>
        <CollectionCard name={"Vietnamese"} numRes={1000}/>
        <CollectionCard name={"Top Bussin"} numRes={60}/>
        <CollectionCard name={"DELISH"} numRes={5}/>
        <NewCollectionCard/>
      </div>
    );
  }


export function CollectionCard(props: { name: string, numRes: number }) {
    return (
        <div className="w-20vw h-20vh min-w-[100px] min-h-[100px] bg-secondary flex justify-center items-center rounded-lg flex-col">
            <h4 className="text-center">{props.name}</h4>
            <p className="text-center text-xs">{props.numRes} Wants</p>
        </div>
    );
}


export function NewCollectionCard() {

    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="border border-primary w-20vw h-20vh min-w-[100px] min-h-[100px] bg-secondary flex justify-center items-center rounded-lg " onClick={handleOpen}>
            <p className="text-2xl text-bold" >+</p>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent style={{ width: '80vw', height: '50vh', borderRadius: '1rem' }}>
                    <DialogHeader>Create New Collection</DialogHeader>
                    
                        <CreateCollectionForm/>
                    
                    <DialogFooter>
                        <span className="grid grid-cols-2 gap-4 place-items-center">
                        <button className="inline-block rounded bg-secondary w-[80px] h-[30px]" onClick={handleClose}>Cancel</button>
                        <button className="inline-block rounded bg-primary w-[80px] h-[30px]">Create</button>
                        </span>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}


export function CreateCollectionForm() {
    const defaults = {
        collectionName: "",
        collectionDescription: "",
        wants: 0,
        displayName: "Noodles",
        username: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    
    
    return(
        <div>
            <p>placeholder</p>
        </div>
    );
}