// not able to make the return type of generic function generic :(
import { Dispatch, SetStateAction } from "react";

export type StateSetter<S> = Dispatch<SetStateAction<S | undefined>>;

export type Maybe<T> = T | undefined | null;
