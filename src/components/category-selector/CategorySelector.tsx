import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import forEach from 'lodash/forEach';
import Measure from 'react-measure';
import PlainButton from '../plain-button';
import DropdownMenu, { MenuToggle } from '../dropdown-menu';
import { Menu, SelectMenuItem } from '../menu';

import messages from './messages';
import './CategorySelector.scss';

interface Category {
    id: string;
    name: React.ReactNode;
}

export interface CategorySelectorProps {
    categories: Array<Category>;
    className?: string;
    currentCategory?: string;
    onSelect: (category: string) => void;
}

const CategorySelector = ({ categories, className, currentCategory = '', onSelect }: CategorySelectorProps) => {
    const linksRef = React.useRef<Element>(null);
    const moreRef = React.useRef<HTMLDivElement>(null);

    const [maxLinks, setMaxLinks] = React.useState(categories.length);
    const [linkWidths, setLinkWidths] = React.useState<{ [category: string]: number }>({});
    const [moreWidth, setMoreWidth] = React.useState(0);

    const outerWidth = (element: HTMLElement) => {
        if (!element) {
            return 0;
        }

        const style = getComputedStyle(element);
        return element.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    };

    React.useLayoutEffect(() => {
        if (moreRef.current) {
            const width = outerWidth(moreRef.current);
            if (width) {
                setMoreWidth(width);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moreRef.current, currentCategory]);

    const renderCategory = ({ id, name, ...rest }: Category) => (
        <span
            key={id}
            className={classnames('bdl-CategorySelector-categoryPill', {
                'is-selected': id === currentCategory,
            })}
            data-category={id}
            data-resin-target="selectcategory"
            data-resin-template_category={name || 'all'}
            data-testid={`template-category-${id || 'all'}`}
            onClick={() => onSelect(id)}
            onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(id);
            }}
            role="button"
            tabIndex={0}
            {...rest}
        >
            {name}
        </span>
    );

    const checkLinks = ({ bounds: { width } }: { bounds: { width: number } }) => {
        if (!linksRef.current) {
            return;
        }

        // Pull in some common widths we'll need
        const containerWidth = width - moreWidth;

        // Get all the links
        const elements = linksRef.current.querySelectorAll('[data-category]');

        // First, calculate the total width of all links in the main section
        let linksWidth = 0;
        forEach(elements, element => {
            if (element instanceof HTMLElement) {
                linksWidth += outerWidth(element);
            }
        });

        if (linksWidth > containerWidth) {
            // The links exceed the container's width. Figure out how many need to be removed
            const linksToRemove: { [category: string]: number } = {};
            let counter = 1;
            while (linksWidth > containerWidth) {
                const element = elements[elements.length - counter];
                if (element instanceof HTMLElement && element.dataset.category) {
                    const elementWidth = outerWidth(element);
                    linksWidth -= elementWidth;

                    // Save the width of the link being removed for use later
                    linksToRemove[element.dataset.category] = elementWidth;
                    counter += 1;
                }
            }

            // Ensure the maxLinks does not become negative
            const max =
                maxLinks - Object.keys(linksToRemove).length < 0 ? 0 : maxLinks - Object.keys(linksToRemove).length;

            // Update the state
            setMaxLinks(max);
            setLinkWidths({
                ...linkWidths,
                ...linksToRemove,
            });
        } else {
            // There is more room, see if any links can be brought back in
            let linksToAdd = 0;

            while (maxLinks + linksToAdd < categories.length && linksWidth <= containerWidth) {
                const category = categories[maxLinks + linksToAdd].id;
                const elementWidth = linkWidths[category];

                // If there is only one link in the More menu, calculate against the total container width,
                // otherwise calculate against the container less the width of the more button
                const targetWidth = maxLinks + linksToAdd + 1 >= categories.length ? width : containerWidth;

                // If the addition of a link is too large, stop checking
                if (linksWidth + elementWidth > targetWidth) {
                    break;
                }
                linksToAdd += 1;
                linksWidth += elementWidth; // always add
            }

            // Update the state
            setMaxLinks(maxLinks + linksToAdd);
        }
    };

    const linkCategories = categories.slice(0, maxLinks);
    const overflowCategories = categories.slice(maxLinks);
    const selectedOverflow = overflowCategories.find(({ id }) => currentCategory === id);

    // This effect must be defined after the checkLinks function
    // If the currently selected category changes, be sure to check for any links to hide or show
    React.useEffect(() => {
        if (linksRef.current) {
            // Note: If <Measure /> is changed to `client`, use `linksRef.current.clientWidth`
            const { width } = linksRef.current.getBoundingClientRect();
            checkLinks({ bounds: { width } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCategory]);

    return (
        /* Note: if `bounds` is changed to client, see note in useEffect above */
        <Measure
            bounds
            innerRef={linksRef}
            onResize={contactRect => {
                const { bounds } = contactRect;
                if (bounds) {
                    checkLinks({ bounds });
                }
            }}
        >
            {({ measureRef }) => (
                <div ref={measureRef} className={classnames('bdl-CategorySelector', className)}>
                    <div className="bdl-CategorySelector-categoryLinks">
                        {renderCategory({
                            id: '',
                            name: <FormattedMessage {...messages.all} />,
                        })}
                        {linkCategories.map(renderCategory)}
                    </div>
                    <div
                        ref={moreRef}
                        className={classnames('bdl-CategorySelector-categoryMore', {
                            'is-hidden': maxLinks >= categories.length,
                        })}
                    >
                        <DropdownMenu className="bdl-CategorySelector-dropdownWrapper" isRightAligned>
                            <PlainButton
                                className={classnames('bdl-CategorySelector-categoryMoreLabel', {
                                    'is-selected': selectedOverflow,
                                })}
                            >
                                <MenuToggle>
                                    {selectedOverflow ? selectedOverflow.name : <FormattedMessage {...messages.more} />}
                                </MenuToggle>
                            </PlainButton>
                            <Menu>
                                {overflowCategories.map(({ id, name }: Category) => (
                                    <SelectMenuItem
                                        key={id}
                                        data-testid={`template-category-more-${id}`}
                                        isSelected={id === currentCategory}
                                        onClick={() => onSelect(id)}
                                    >
                                        {name}
                                    </SelectMenuItem>
                                ))}
                            </Menu>
                        </DropdownMenu>
                    </div>
                </div>
            )}
        </Measure>
    );
};

export default CategorySelector;
