# React & Redux in TypeScript - 静态类型指南

> 作者：Yzz
掘金：https://juejin.im/post/5c984e6651882510d82b7986 

## React - 关键类型

- 展示性组件（FunctionComponent）

```js
React.FunctionComponent<P> or React.FC<P>。
const MyComponent: React.FC<Props> = ...
```

- 有状态组件（ClassComponent）

```js
React.Component<P, S>
class MyComponent extends React.Component<Props, State> { ...
```

- 组件Props

```js
React.ComponentProps<typeof Component>
获取组件（适用于ClassComponent、FunctionComponent）的Props的类型
type MyComponentProps = React.ComponentProps<typeof MyComponent>;

React.FC | React.Component的联合类型
React.ComponentType<P>
const withState = <P extends WrappedComponentProps>(
    WrappedComponent: React.ComponentType<P>,
) => { ...
```

- React 要素

```js
React.ReactElement<P> or JSX.Element
表示React元素概念的类型 - DOM组件（例如）或用户定义的复合组件（）
const elementOnly: React.ReactElement = <div /> || <MyComponent />;
```

- React Node

> React.ReactNode

```js
表示任何类型的React节点（基本上是ReactElement（包括Fragments和Portals）+ 原始JS类型 的合集）
const elementOrPrimitive: React.ReactNode = 'string' || 0 || false || null || undefined || <div /> || <MyComponent />;
const Component = ({ children: React.ReactNode }) => ...
```

- React CSS属性

> React.CSSProperties

```js
代表着Style Object在 JSX 文件中（通常用于 css-in-js）
const styles: React.CSSProperties = { flexDirection: 'row', ...
const element = <div style={styles} ...
```

- 通用的 React Event Handler

```js
React.ReactEventHandler<HTMLElement>
const handleChange: React.ReactEventHandler<HTMLInputElement> = (ev) => { ... } 
<input onChange={handleChange} ... />
```

- 特殊的 React Event Handler

```js
React.MouseEvent<E> | React.KeyboardEvent<E> | React.TouchEvent<E>
const handleChange = (ev: React.MouseEvent<HTMLDivElement>) => { ... }

<div onMouseMove={handleChange} ... />
```

## React 组件模式

- Function Components - FC 纯函数组件（无状态）

>顾名思义，纯函数组件本身不具备 State，所以没有状态，一切通过 Props

```js
import React, { FC, ReactElement, MouseEvent  } from 'react'

type Props = {
    label: string,
    children: ReactElement,
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const FunctionComponent: FC<Props> = ({ label, children, onClick }: Props) => {
    return (
        <div>
            <span>
                {label}：
            </span>
            <button type="button" onClick={onClick}>
                {children}
            </button>
        </div>
    )
}

export default FunctionComponent
```

- 扩展属性（spread attributes）

> 利用 ... 对剩余属性进行处理

```js
import React, { FC, ReactElement, MouseEvent, CSSProperties } from 'react'

type Props = {
    label: string,
    children: ReactElement,
    className?: string,
    style?: CSSProperties,
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void,
}

const FunctionComponent: FC<Props> = ({ label, children, onClick, ...resetProps }: Props) => {
    return (
        <div {...resetProps}>
            <span>{label}：</span>
            <button type="button" onClick={onClick}>
                {children}
            </button>
        </div>
    )
}

export default FunctionComponent
```

默认属性

> 如果，需要默认属性，可以通过默认参数值来处理

```js
import React, { FC, ReactElement, MouseEvent  } from 'react'

type Props = {
    label?: string,
    children: ReactElement,
}

const FunctionComponent: FC<Props> = ({ label = 'Hello', children }: Props) => {
    return (
        <div>
            <span>
                {label}：
            </span>
            <button type="button">
                {children}
            </button>
        </div>
    )
}

export default FunctionComponent
```

- Class Components

>相对于FC，多了 state，采用如下形式来定义Class Component

这一部分的写法，与TypeScript 2.8下的终极React组件模式相同，觉得结构很清晰，复用。

```js
import React, { Component } from 'react';

type Props = {
    label: string
}

const initialState  = {
    count: 0
}

type State = Readonly<typeof initialState>

class ClassCounter extends Component<Props, State> {
    readonly state: State = initialState

    private handleIncrement = () => this.setState(Increment)

    render() {
        const { handleIncrement } = this;
        const { label } = this.props;
        const { count } = this.state;

        return (
            <div>
                <span>
                    {label}: {count}
                </span>
                <button type="button" onClick={handleIncrement}>
                    {`Increment`}
                </button>
            </div>
        )
    }
}

export const Increment = (preState: State) => ({ count: preState.count + 1 })

export default ClassCounter
```

默认属性

> 处理 Class Component 的默认属性，主要有两种方法：

1. 是定义高阶组件，例如TypeScript 2.8下的终极React组件模式中，利用 withDefaultProps 来定义默认属性，涉及组件的属性的类型转换；
2. 是利用 static props 以及 componentWillReceiveProps，处理默认属性。

> 具体业务中，视情况而定，第一中可以查看相关文章，这里介绍第二种

```js
import React, { Component } from 'react';

type Props = {
    label: string,
    initialCount: number
}

type State = {
    count: number;
}

class ClassCounter extends Component<Props, State> {
    static defaultProps = {
        initialCount: 1,
    }
    // 依据 defaultProps 对 state 进行处理
    readonly state: State = {
        count: this.props.initialCount,
    }
    private handleIncrement = () => this.setState(Increment)
	// 响应 defaultProps 的变化
    componentWillReceiveProps({ initialCount }: Props) {
        if (initialCount != null && initialCount !== this.props.initialCount) {
            this.setState({ count: initialCount })
        }
    }

    render() {
        const { handleIncrement } = this;
        const { label } = this.props;
        const { count } = this.state;

        return (
            <div>
                <span>
                    {label}: {count}
                </span>
                <button type="button" onClick={handleIncrement}>
                    {`Increment`}
                </button>
            </div>
        )
    }
}

export const Increment = (preState: State) => ({ count: preState.count + 1 })

export default ClassCounter
```

- 通用组件 Generic Components

复用共有的逻辑创建组件
常用于通用列表

```js
import React, { Component, ReactElement } from 'react'

interface GenericListProps<T> {
    items: T[],
    itemRenderer: (item: T, i: number) => ReactElement,
}

class GenericList<T> extends Component<GenericListProps<T>, {}> {
    render() {
        const { items, itemRenderer } = this.props

        return <div>{items.map(itemRenderer)}</div>
    }
}

export default GenericList
```

- Render Callback & Render Props

Render Callback，也被称为函数子组件，就是将 children 替换为 () => children；

Render Props，就是将 () => component 作为 Props 传递下去。

```js
import React, { Component, ReactElement } from 'react';

type Props = {
    PropRender?: () => ReactElement,
    children?: () => ReactElement
}

class PropRender extends Component<Props, {}> {

    render() {
        const { props: { children, PropRender } }: { props: Props } = this;

        return (
            <div>
                { PropRender && PropRender() }
                { children && children() }
            </div>
        )
    }
}

export default PropRender

// 应用
<PropsRender
    PropRender={() => (<p>Prop Render</p>)}
>
    { () => (<p>Child Render</p>) }
</PropsRender>
```

- HOC（Higher-Order Components）

> 简单理解为，接受React组件作为输入，输出一个新的React组件的组件的工厂函数。

```js
import * as React from 'react'

interface InjectedProps {
    label: string
}

export const withState = <BaseProps extends InjectedProps>(
    BaseComponent: React.ComponentType<BaseProps>
) => {
    type HocProps = BaseProps & InjectedProps & {
        initialCount?: number
    }
    type HocState = {
        readonly count: number
    }

    return class Hoc extends React.Component<HocProps, HocState> {
        // 方便 debugging in React-Dev-Tools
        static displayName = `withState(${BaseComponent.name})`;
        // 关联原始的 wrapped component
        static readonly WrappedComponent = BaseComponent;

        readonly state: HocState = {
            count: Number(this.props.initialCount) || 0,
        }

        handleIncrement = () => {
            this.setState({ count: this.state.count + 1 })
        }

        render() {
            const { ...restProps } = this.props as any
            const { count } = this.state

            return (
                <>
                    {count}
                    <BaseComponent
                        onClick={this.handleIncrement}
                        {...restProps}
                    />
                </>
            )
        }
    }
}
```

- Redux - 使用以及 Redux Thunk 使用

以如下形式来介绍Redux，主要是in-ts的使用：

1. (prestate, action) => state；
2. 使用Redux Thunk 来出来异步操作。

```js
// store.js

type DataType = {
    counter: number
}

const DataState: DataType = {
    counter: 0
}

type RootState = {
    Data: DataType
}

export default RootState
```

```js
// action.js
import { Action, AnyAction } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import RootState from '../store/index'

type IncrementPayload = {
    value: number
}

interface IncrementAction extends Action {
    type: 'INCREMENT',
    payload: IncrementPayload
}

export const Increment = ({ value }: IncrementPayload): IncrementAction => {
    const payload = { value }
    return {
        type: 'INCREMENT',
        payload
    }
}

export type DecrementPayload = {
    value: number;
};

export interface DecrementAction extends Action {
    type: 'DECREMENT';
    payload: DecrementPayload;
}

export type RootAction = IncrementAction & DecrementAction;

export const asyncIncrement = (
    payload: IncrementPayload
): ThunkAction<Promise<void>, RootState, void, AnyAction> => {
    return async (dispatch: ThunkDispatch<RootState, void, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {

            console.log('Login in progress')
            setTimeout(() => {
                dispatch(Increment(payload))
                setTimeout(() => {
                    resolve()
                }, 1000)
            }, 3000)
        })
    }
}
```

```js
// reducer.js
import { DataState, DataType } from '../store/Data'
import { RootAction } from '../actions/'

export default function (state: DataType = DataState, { type, payload }: RootAction): DataType {
    switch(type) {
        case 'INCREMENT':
            return {
                ...state,
                counter: state.counter + payload.value,
            };
        default:
            return state;
    }
}
```

```js
// Hearder.js
import React, { Component, ReactNode } from 'react'
import RootState from '../store/index'
import { Dispatch, AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { Increment, asyncIncrement } from '../actions/'

const initialState = {
    name: 'string'
}

type StateToPropsType = Readonly<{
    counter: number
}>
type DispatchToPropsType = Readonly<{
    handleAdd: () => void,
    handleDec: () => void
}>

type StateType = Readonly<typeof initialState>
type PropsType = {
    children?: ReactNode
}
type ComponentProps = StateToPropsType & DispatchToPropsType & PropsType

class Header extends Component<ComponentProps, StateType> {
    readonly state: StateType = initialState;

    render() {
        const { props: { handleAdd, handleDec, counter }, state: { name } } = this

        return (
            <div>
                计数：{counter}
                <button onClick={handleAdd}>+</button>
                <button onClick={handleDec}>-</button>
            </div>
        )
    }

    private handleClick = () => this.setState(sayHello);
}

const sayHello = (prevState: StateType) => ({
    name: prevState.name + 'Hello world',
})

const mapStateToProps = (state: RootState, props: PropsType): StateToPropsType => {
    return {
        counter: state.Data.counter
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, AnyAction>): DispatchToPropsType => {
    return {
        handleAdd: () => {
            dispatch(Increment({ value: 2 }))
        },
        handleDec: async () => {
            dispatch(asyncIncrement({ value: 10 }))
        }
    }
}

export default connect<StateToPropsType, DispatchToPropsType, PropsType, RootState>(mapStateToProps, mapDispatchToProps)(Header)
```